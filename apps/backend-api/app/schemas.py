from datetime import datetime

from pydantic import BaseModel


class WarehouseBase(BaseModel):
    code: str
    name: str
    city: str


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseRead(WarehouseBase):
    id: int

    class Config:
        from_attributes = True


class ItemBase(BaseModel):
    sku: str
    name: str
    quantity: int
    warehouse_code: str


class ItemCreate(ItemBase):
    pass


class ItemRead(ItemBase):
    id: int

    class Config:
        from_attributes = True


class ItemUpdate(BaseModel):
    name: str
    quantity: int
    warehouse_code: str


class StockMovementCreate(BaseModel):
    sku: str
    quantity: int
    movement_type: str
    warehouse_code: str


class StockAdjustment(BaseModel):
    quantity: int
    movement_type: str
    warehouse_code: str


class StockMovementRead(StockMovementCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SummaryRead(BaseModel):
    total_skus: int
    total_units: int
    low_stock_count: int
    last_updated: str


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str
    full_name: str


class UserRead(BaseModel):
    username: str
    role: str
    full_name: str
