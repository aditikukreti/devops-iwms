"""initial schema"""

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa


def upgrade() -> None:
    op.create_table(
        "warehouses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
    )
    op.create_index("ix_warehouses_code", "warehouses", ["code"], unique=True)
    op.create_index("ix_warehouses_id", "warehouses", ["id"], unique=False)

    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("sku", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("warehouse_code", sa.String(length=50), nullable=False),
    )
    op.create_index("ix_items_id", "items", ["id"], unique=False)
    op.create_index("ix_items_sku", "items", ["sku"], unique=True)
    op.create_index("ix_items_warehouse_code", "items", ["warehouse_code"], unique=False)

    op.create_table(
        "stock_movements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("sku", sa.String(length=50), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("movement_type", sa.String(length=50), nullable=False),
        sa.Column("warehouse_code", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_stock_movements_id", "stock_movements", ["id"], unique=False)
    op.create_index("ix_stock_movements_sku", "stock_movements", ["sku"], unique=False)
    op.create_index(
        "ix_stock_movements_warehouse_code",
        "stock_movements",
        ["warehouse_code"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_stock_movements_warehouse_code", table_name="stock_movements")
    op.drop_index("ix_stock_movements_sku", table_name="stock_movements")
    op.drop_index("ix_stock_movements_id", table_name="stock_movements")
    op.drop_table("stock_movements")
    op.drop_index("ix_items_warehouse_code", table_name="items")
    op.drop_index("ix_items_sku", table_name="items")
    op.drop_index("ix_items_id", table_name="items")
    op.drop_table("items")
    op.drop_index("ix_warehouses_id", table_name="warehouses")
    op.drop_index("ix_warehouses_code", table_name="warehouses")
    op.drop_table("warehouses")
