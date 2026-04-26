from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import authenticate_user, create_access_token, get_current_user, require_roles
from app.database import SessionLocal
from app.models import Item, StockMovement, Warehouse
from app.schemas import (
    ItemCreate,
    ItemRead,
    ItemUpdate,
    LoginRequest,
    LoginResponse,
    StockAdjustment,
    StockMovementCreate,
    StockMovementRead,
    SummaryRead,
    UserRead,
    WarehouseCreate,
    WarehouseRead,
)


app = FastAPI(title="Inventory Platform API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data(db: Session) -> None:
    if db.query(Warehouse).count() > 0:
        return

    warehouses = [
        Warehouse(code="MUM-A1", name="Mumbai Central Warehouse", city="Mumbai"),
        Warehouse(code="DEL-B2", name="Delhi Packaging Hub", city="Delhi"),
        Warehouse(code="BLR-C3", name="Bengaluru Device Store", city="Bengaluru"),
    ]
    db.add_all(warehouses)

    items = [
        Item(sku="SKU-1001", name="Barcode Scanner", quantity=18, warehouse_code="MUM-A1"),
        Item(sku="SKU-1002", name="Packing Tape", quantity=64, warehouse_code="DEL-B2"),
        Item(sku="SKU-1003", name="Thermal Printer", quantity=7, warehouse_code="BLR-C3"),
    ]
    db.add_all(items)

    movements = [
        StockMovement(sku="SKU-1001", quantity=5, movement_type="stock_in", warehouse_code="MUM-A1"),
        StockMovement(sku="SKU-1003", quantity=2, movement_type="stock_out", warehouse_code="BLR-C3"),
    ]
    db.add_all(movements)
    db.commit()


@app.on_event("startup")
def on_startup() -> None:
    with SessionLocal() as db:
        seed_data(db)


@app.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    db.execute(select(func.now()))
    return {"status": "ok", "service": "backend-api", "database": "connected"}


@app.post("/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    user = authenticate_user(payload.username, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(user["username"], user["role"])
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        username=user["username"],
        role=user["role"],
        full_name=user["full_name"],
    )


@app.get("/auth/me", response_model=UserRead)
def me(user: dict = Depends(get_current_user)) -> UserRead:
    return UserRead(
        username=user["username"],
        role=user["role"],
        full_name=user["full_name"],
    )


@app.get("/api/summary", response_model=SummaryRead)
def summary(db: Session = Depends(get_db)) -> SummaryRead:
    total_skus = db.query(Item).count()
    total_units = db.query(func.coalesce(func.sum(Item.quantity), 0)).scalar() or 0
    low_stock_count = db.query(Item).filter(Item.quantity < 10).count()
    return SummaryRead(
        total_skus=total_skus,
        total_units=total_units,
        low_stock_count=low_stock_count,
        last_updated=datetime.now(timezone.utc).isoformat(),
    )


@app.get("/api/items", response_model=list[ItemRead])
def list_items(db: Session = Depends(get_db)) -> list[Item]:
    return db.query(Item).order_by(Item.sku.asc()).all()


@app.post("/api/items", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
def create_item(
    payload: ItemCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin", "manager")),
) -> Item:
    warehouse = db.query(Warehouse).filter(Warehouse.code == payload.warehouse_code).first()
    if warehouse is None:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    existing_item = db.query(Item).filter(Item.sku == payload.sku).first()
    if existing_item is not None:
        raise HTTPException(status_code=409, detail="SKU already exists")

    item = Item(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.put("/api/items/{sku}", response_model=ItemRead)
def update_item(
    sku: str,
    payload: ItemUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin", "manager")),
) -> Item:
    item = db.query(Item).filter(Item.sku == sku).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    warehouse = db.query(Warehouse).filter(Warehouse.code == payload.warehouse_code).first()
    if warehouse is None:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    item.name = payload.name
    item.quantity = payload.quantity
    item.warehouse_code = payload.warehouse_code
    db.commit()
    db.refresh(item)
    return item


@app.delete("/api/items/{sku}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    sku: str,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin")),
) -> None:
    item = db.query(Item).filter(Item.sku == sku).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    db.query(StockMovement).filter(StockMovement.sku == sku).delete()
    db.delete(item)
    db.commit()


@app.get("/api/warehouses", response_model=list[WarehouseRead])
def list_warehouses(db: Session = Depends(get_db)) -> list[Warehouse]:
    return db.query(Warehouse).order_by(Warehouse.code.asc()).all()


@app.post("/api/warehouses", response_model=WarehouseRead, status_code=status.HTTP_201_CREATED)
def create_warehouse(
    payload: WarehouseCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin", "manager")),
) -> Warehouse:
    existing_warehouse = db.query(Warehouse).filter(Warehouse.code == payload.code).first()
    if existing_warehouse is not None:
        raise HTTPException(status_code=409, detail="Warehouse code already exists")

    warehouse = Warehouse(**payload.model_dump())
    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)
    return warehouse


@app.delete("/api/warehouses/{code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_warehouse(
    code: str,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin")),
) -> None:
    warehouse = db.query(Warehouse).filter(Warehouse.code == code).first()
    if warehouse is None:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    item_count = db.query(Item).filter(Item.warehouse_code == code).count()
    if item_count > 0:
        raise HTTPException(status_code=400, detail="Warehouse still has assigned items")

    db.query(StockMovement).filter(StockMovement.warehouse_code == code).delete()
    db.delete(warehouse)
    db.commit()


@app.get("/api/movements", response_model=list[StockMovementRead])
def list_movements(db: Session = Depends(get_db)) -> list[StockMovement]:
    return db.query(StockMovement).order_by(StockMovement.created_at.desc()).all()


@app.post("/api/movements", response_model=StockMovementRead, status_code=status.HTTP_201_CREATED)
def create_movement(
    payload: StockMovementCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin", "manager")),
) -> StockMovement:
    item = db.query(Item).filter(Item.sku == payload.sku).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    warehouse = db.query(Warehouse).filter(Warehouse.code == payload.warehouse_code).first()
    if warehouse is None:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    if payload.movement_type == "stock_out" and item.quantity < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    if payload.movement_type == "stock_in":
        item.quantity += payload.quantity
    elif payload.movement_type == "stock_out":
        item.quantity -= payload.quantity
    else:
        raise HTTPException(status_code=400, detail="Unsupported movement type")

    movement = StockMovement(**payload.model_dump())
    db.add(movement)
    db.commit()
    db.refresh(movement)
    return movement


@app.post("/api/items/{sku}/adjust", response_model=StockMovementRead, status_code=status.HTTP_201_CREATED)
def adjust_item_stock(
    sku: str,
    payload: StockAdjustment,
    db: Session = Depends(get_db),
    user: dict = Depends(require_roles("admin", "manager")),
) -> StockMovement:
    movement_payload = StockMovementCreate(
        sku=sku,
        quantity=payload.quantity,
        movement_type=payload.movement_type,
        warehouse_code=payload.warehouse_code,
    )
    return create_movement(movement_payload, db, user)
