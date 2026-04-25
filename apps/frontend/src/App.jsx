import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:8000";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", kicker: "Command" },
  { id: "inventory", label: "Inventory", kicker: "Stock" },
  { id: "warehouses", label: "Warehouses", kicker: "Sites" },
  { id: "movements", label: "Movements", kicker: "Flow" },
  { id: "devops", label: "DevOps", kicker: "Platform" },
];

const DEMO_USERS = [
  "admin / admin123",
  "manager / manager123",
  "viewer / viewer123",
];

export default function App() {
  const [activeView, setActiveView] = useState(getInitialView());
  const [session, setSession] = useState(() => loadSession());
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "admin123" });
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [movements, setMovements] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [warehouseSearch, setWarehouseSearch] = useState("");
  const [itemForm, setItemForm] = useState({ sku: "", name: "", quantity: 0, warehouse_code: "" });
  const [warehouseForm, setWarehouseForm] = useState({ code: "", name: "", city: "" });
  const [adjustmentForm, setAdjustmentForm] = useState({
    sku: "",
    quantity: 1,
    movement_type: "stock_in",
    warehouse_code: "",
  });

  const canManage = session && ["admin", "manager"].includes(session.role);
  const canDelete = session && session.role === "admin";

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    loadDashboard();
  }, [session]);

  useEffect(() => {
    function handleHashChange() {
      setActiveView(getViewFromHash(window.location.hash));
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  async function apiFetch(path, options = {}, requiresAuth = false) {
    const headers = { ...(options.headers || {}) };
    if (options.body) {
      headers["Content-Type"] = "application/json";
    }
    if (requiresAuth && session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.detail || "Request failed");
    }
    return response.status === 204 ? null : response.json();
  }

  async function loadDashboard() {
    try {
      setError("");
      setLoading(true);
      const [summaryData, itemsData, movementsData, warehousesData] = await Promise.all([
        apiFetch("/api/summary"),
        apiFetch("/api/items"),
        apiFetch("/api/movements"),
        apiFetch("/api/warehouses"),
      ]);

      setSummary({
        totalSkus: summaryData.total_skus,
        totalUnits: summaryData.total_units,
        lowStock: summaryData.low_stock_count,
        warehouses: warehousesData.length,
      });
      setItems(itemsData);
      setMovements(movementsData);
      setWarehouses(warehousesData);
      setItemForm((current) => ({
        ...current,
        warehouse_code: current.warehouse_code || warehousesData[0]?.code || "",
      }));
      setAdjustmentForm((current) => ({
        ...current,
        sku: current.sku || itemsData[0]?.sku || "",
        warehouse_code:
          current.warehouse_code ||
          itemsData.find((item) => item.sku === (current.sku || itemsData[0]?.sku))?.warehouse_code ||
          warehousesData[0]?.code ||
          "",
      }));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const loginData = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      saveSession(loginData);
      setSession(loginData);
      setMessage(`Signed in as ${loginData.full_name} (${loginData.role}).`);
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setMessage("");
    setError("");
  }

  async function handleWarehouseSubmit(event) {
    event.preventDefault();
    try {
      await apiFetch("/api/warehouses", {
        method: "POST",
        body: JSON.stringify(warehouseForm),
      }, true);
      setWarehouseForm({ code: "", name: "", city: "" });
      setMessage("Warehouse created.");
      await loadDashboard();
      navigateTo("warehouses");
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  async function handleItemSubmit(event) {
    event.preventDefault();
    try {
      await apiFetch("/api/items", {
        method: "POST",
        body: JSON.stringify({ ...itemForm, quantity: Number(itemForm.quantity) }),
      }, true);
      setItemForm((current) => ({ sku: "", name: "", quantity: 0, warehouse_code: current.warehouse_code }));
      setMessage("Item created.");
      await loadDashboard();
      navigateTo("inventory");
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  async function handleAdjustmentSubmit(event) {
    event.preventDefault();
    try {
      await apiFetch(`/api/items/${adjustmentForm.sku}/adjust`, {
        method: "POST",
        body: JSON.stringify({
          quantity: Number(adjustmentForm.quantity),
          movement_type: adjustmentForm.movement_type,
          warehouse_code: adjustmentForm.warehouse_code,
        }),
      }, true);
      setMessage("Stock adjusted.");
      await loadDashboard();
      navigateTo("movements");
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  async function handleDeleteItem(sku) {
    try {
      await apiFetch(`/api/items/${sku}`, { method: "DELETE" }, true);
      setMessage(`Item ${sku} deleted.`);
      await loadDashboard();
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  async function handleDeleteWarehouse(code) {
    try {
      await apiFetch(`/api/warehouses/${code}`, { method: "DELETE" }, true);
      setMessage(`Warehouse ${code} deleted.`);
      await loadDashboard();
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  function handleAdjustmentSkuChange(nextSku) {
    const selectedItem = items.find((item) => item.sku === nextSku);
    setAdjustmentForm((current) => ({
      ...current,
      sku: nextSku,
      warehouse_code: selectedItem?.warehouse_code || current.warehouse_code,
    }));
  }

  const warehouseStats = useMemo(
    () =>
      warehouses.map((warehouse) => {
        const warehouseItems = items.filter((item) => item.warehouse_code === warehouse.code);
        return {
          ...warehouse,
          skuCount: warehouseItems.length,
          totalUnits: warehouseItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }),
    [items, warehouses]
  );

  const maxUnits = Math.max(...warehouseStats.map((warehouse) => warehouse.totalUnits), 1);
  const lowStockItems = items.filter((item) => item.quantity < 10);
  const stockInCount = movements.filter((movement) => movement.movement_type === "stock_in").length;
  const stockOutCount = movements.filter((movement) => movement.movement_type === "stock_out").length;
  const throughputTotal = Math.max(stockInCount + stockOutCount, 1);
  const filteredItems = items.filter((item) =>
    [item.sku, item.name, item.warehouse_code].some((value) =>
      value.toLowerCase().includes(inventorySearch.toLowerCase())
    )
  );
  const filteredWarehouses = warehouseStats.filter((warehouse) =>
    [warehouse.code, warehouse.name, warehouse.city].some((value) =>
      value.toLowerCase().includes(warehouseSearch.toLowerCase())
    )
  );

  if (!session) {
    return (
      <main className="loading-shell">
        <section className="panel auth-panel">
          <p className="eyebrow">Secure Access</p>
          <h2>Sign in to the warehouse platform.</h2>
          <p className="subtitle">
            Demo users: {DEMO_USERS.join(" , ")}.
          </p>
          <form className="form-grid" onSubmit={handleLogin}>
            <input
              placeholder="Username"
              value={loginForm.username}
              onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
            />
            <button type="submit">Sign In</button>
          </form>
          {error ? <p>{error}</p> : null}
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="loading-shell">
        <section className="panel"><h2>Loading command center...</h2><p>Syncing inventory, warehouse, and movement data from the API.</p></section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="loading-shell">
        <section className="panel"><h2>Dashboard unavailable</h2><p>{error}</p></section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="brand-kicker">InventoryOS</p>
          <h1>Warehouse Control</h1>
          <span>Dark ops panel for stock, sites, and delivery.</span>
        </div>
        <nav className="side-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} className={item.id === activeView ? "nav-item active" : "nav-item"} onClick={() => navigateTo(item.id)} type="button">
              <span>{item.kicker}</span><strong>{item.label}</strong>
            </button>
          ))}
        </nav>
        <section className="sidebar-card">
          <p className="section-tag">Session</p>
          <div className="mini-metric"><span>User</span><strong>{session.full_name}</strong></div>
          <div className="mini-metric"><span>Role</span><strong>{session.role}</strong></div>
          <button className="table-action" type="button" onClick={handleLogout}>Sign Out</button>
        </section>
      </aside>

      <section className="content-shell">
        <header className="topbar panel">
          <div><p className="eyebrow">Multi-Section Workspace</p><h2>{NAV_ITEMS.find((item) => item.id === activeView)?.label}</h2></div>
          <div className="topbar-status">
            <span>API online</span><span>Postgres connected</span><span>{session.role} access</span>
          </div>
        </header>

        {message ? <section className="panel status-panel"><strong>System message</strong><p>{message}</p></section> : null}

        {activeView === "overview" ? (
          <>
            <section className="hero hero-grid">
              <div className="hero-copy panel panel-accent">
                <p className="eyebrow">Dark Ops Command Center</p>
                <h2>Warehouse flow, stock risk, and platform health in one control room.</h2>
                <p className="subtitle">Run the app locally, ship through CI, and graduate to Kubernetes and AWS when the platform is ready.</p>
                <div className="hero-badges"><span>Docker</span><span>FastAPI</span><span>PostgreSQL</span><span>React</span><span>Terraform</span><span>Ansible</span></div>
              </div>
              <div className="hero-side">
                <section className="panel"><div className="section-heading"><span className="section-tag">Runtime</span><h3>Platform Status</h3></div><div className="status-grid"><article><span>API</span><strong>Online</strong></article><article><span>Database</span><strong>Connected</strong></article><article><span>Pipeline</span><strong>Ready</strong></article><article><span>Role</span><strong>{session.role}</strong></article></div></section>
                <section className="panel"><div className="section-heading"><span className="section-tag">Delivery</span><h3>DevOps Path</h3></div><div className="pipeline-steps"><span className="active">Code</span><span className="active">Compose</span><span className="active">CI</span><span>kind</span><span>AWS</span></div></section>
              </div>
            </section>
            <section className="metrics"><MetricCard label="Total SKUs" value={summary?.totalSkus ?? 0} /><MetricCard label="Total Units" value={summary?.totalUnits ?? 0} /><MetricCard label="Low Stock Alerts" value={summary?.lowStock ?? 0} /><MetricCard label="Warehouses" value={summary?.warehouses ?? 0} /></section>
            <section className="analytics-grid">
              <section className="panel"><div className="section-heading"><span className="section-tag">Capacity</span><h3>Warehouse Load</h3></div><div className="bar-chart">{warehouseStats.map((warehouse) => <div key={warehouse.code} className="bar-row"><div className="bar-label"><strong>{warehouse.code}</strong><span>{warehouse.totalUnits} units</span></div><div className="bar-track"><div className="bar-fill" style={{ width: `${(warehouse.totalUnits / maxUnits) * 100}%` }} /></div></div>)}</div></section>
              <section className="panel"><div className="section-heading"><span className="section-tag">Flow</span><h3>Movement Mix</h3></div><div className="donut-wrap"><div className="donut-chart" style={{ background: `conic-gradient(#6ee7f9 0 ${(stockInCount / throughputTotal) * 360}deg, #7c3aed ${(stockInCount / throughputTotal) * 360}deg 360deg)` }}><div className="donut-center"><strong>{movements.length}</strong><span>events</span></div></div><div className="legend"><div><span className="swatch cyan" /><p>Stock In: {stockInCount}</p></div><div><span className="swatch violet" /><p>Stock Out: {stockOutCount}</p></div></div></div></section>
              <section className="panel"><div className="section-heading"><span className="section-tag">Risk</span><h3>Low Stock Queue</h3></div><div className="alert-stack">{lowStockItems.length ? lowStockItems.map((item) => <article key={item.sku} className="alert-card"><div><strong>{item.sku}</strong><p>{item.name}</p></div><div className="alert-metric"><span>{item.quantity} left</span><p>{item.warehouse_code}</p></div></article>) : <article className="alert-card"><div><strong>All clear</strong><p>No current low-stock alerts.</p></div></article>}</div></section>
            </section>
          </>
        ) : null}

        {activeView === "inventory" ? <section className="section-stack"><section className="panel-grid forms"><section className="panel"><h3>Create Item</h3>{canManage ? <form className="form-grid" onSubmit={handleItemSubmit}><input placeholder="SKU" value={itemForm.sku} onChange={(event) => setItemForm((current) => ({ ...current, sku: event.target.value }))} required /><input placeholder="Item name" value={itemForm.name} onChange={(event) => setItemForm((current) => ({ ...current, name: event.target.value }))} required /><input type="number" min="0" placeholder="Quantity" value={itemForm.quantity} onChange={(event) => setItemForm((current) => ({ ...current, quantity: event.target.value }))} required /><select value={itemForm.warehouse_code} onChange={(event) => setItemForm((current) => ({ ...current, warehouse_code: event.target.value }))} required><option value="">Select warehouse</option>{warehouses.map((warehouse) => <option key={warehouse.code} value={warehouse.code}>{warehouse.code}</option>)}</select><button type="submit">Add Item</button></form> : <p className="subtitle">Viewer role can inspect inventory but cannot create or modify stock.</p>}</section><section className="panel"><h3>Inventory Focus</h3><div className="inventory-highlights"><InfoPill label="Tracked SKUs" value={items.length} /><InfoPill label="Low Stock" value={lowStockItems.length} /><InfoPill label="Largest Quantity" value={Math.max(...items.map((item) => item.quantity), 0)} /></div><div className="search-wrap"><input placeholder="Search SKU, item, or warehouse" value={inventorySearch} onChange={(event) => setInventorySearch(event.target.value)} /></div></section></section><section className="panel"><div className="section-heading"><span className="section-tag">Inventory</span><h3>Stock Ledger</h3></div><table><thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th>Warehouse</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.sku}><td>{item.sku}</td><td>{item.name}</td><td>{item.quantity}</td><td>{item.warehouse_code}</td><td><span className={item.quantity < 10 ? "status-chip danger" : "status-chip"}>{item.quantity < 10 ? "Low stock" : "Healthy"}</span></td><td>{canDelete ? <button className="table-action danger" type="button" onClick={() => handleDeleteItem(item.sku)}>Delete</button> : <span className="muted-label">Restricted</span>}</td></tr>)}</tbody></table></section></section> : null}

        {activeView === "warehouses" ? <section className="section-stack"><section className="panel-grid forms"><section className="panel"><h3>Create Warehouse</h3>{canManage ? <form className="form-grid" onSubmit={handleWarehouseSubmit}><input placeholder="Code" value={warehouseForm.code} onChange={(event) => setWarehouseForm((current) => ({ ...current, code: event.target.value }))} required /><input placeholder="Name" value={warehouseForm.name} onChange={(event) => setWarehouseForm((current) => ({ ...current, name: event.target.value }))} required /><input placeholder="City" value={warehouseForm.city} onChange={(event) => setWarehouseForm((current) => ({ ...current, city: event.target.value }))} required /><button type="submit">Add Warehouse</button></form> : <p className="subtitle">Viewer role can inspect warehouse sites but cannot create or delete them.</p>}</section><section className="panel"><h3>Site Coverage</h3><div className="inventory-highlights"><InfoPill label="Warehouses" value={warehouses.length} /><InfoPill label="Cities" value={new Set(warehouses.map((w) => w.city)).size} /><InfoPill label="Total Units" value={summary?.totalUnits ?? 0} /></div><div className="search-wrap"><input placeholder="Search code, site, or city" value={warehouseSearch} onChange={(event) => setWarehouseSearch(event.target.value)} /></div></section></section><section className="panel warehouse-panel"><div className="section-heading"><span className="section-tag">Sites</span><h3>Warehouse Grid</h3></div><div className="warehouse-grid">{filteredWarehouses.map((warehouse) => <article key={warehouse.code} className="warehouse-card"><div><p className="warehouse-code">{warehouse.code}</p><h3>{warehouse.name}</h3><span>{warehouse.city}</span></div><div className="warehouse-stats"><div><strong>{warehouse.skuCount}</strong><span>SKUs</span></div><div><strong>{warehouse.totalUnits}</strong><span>Units</span></div></div>{canDelete ? <button className="table-action danger" type="button" onClick={() => handleDeleteWarehouse(warehouse.code)}>Delete Warehouse</button> : <span className="muted-label">Admin only delete</span>}</article>)}</div></section></section> : null}

        {activeView === "movements" ? <section className="section-stack"><section className="panel-grid forms"><section className="panel"><h3>Adjust Stock</h3>{canManage ? <form className="form-grid" onSubmit={handleAdjustmentSubmit}><select value={adjustmentForm.sku} onChange={(event) => handleAdjustmentSkuChange(event.target.value)} required><option value="">Select SKU</option>{items.map((item) => <option key={item.sku} value={item.sku}>{item.sku}</option>)}</select><select value={adjustmentForm.movement_type} onChange={(event) => setAdjustmentForm((current) => ({ ...current, movement_type: event.target.value }))}><option value="stock_in">Stock In</option><option value="stock_out">Stock Out</option></select><input type="number" min="1" placeholder="Quantity" value={adjustmentForm.quantity} onChange={(event) => setAdjustmentForm((current) => ({ ...current, quantity: event.target.value }))} required /><select value={adjustmentForm.warehouse_code} onChange={(event) => setAdjustmentForm((current) => ({ ...current, warehouse_code: event.target.value }))} required><option value="">Select warehouse</option>{warehouses.map((warehouse) => <option key={warehouse.code} value={warehouse.code}>{warehouse.code}</option>)}</select><button type="submit">Apply Adjustment</button></form> : <p className="subtitle">Viewer role can inspect movement history but cannot adjust stock.</p>}</section><section className="panel"><h3>Flow Snapshot</h3><div className="inventory-highlights"><InfoPill label="Stock In" value={stockInCount} /><InfoPill label="Stock Out" value={stockOutCount} /><InfoPill label="Events" value={movements.length} /></div></section></section><section className="panel"><div className="section-heading"><span className="section-tag">Movements</span><h3>Recent Stock Events</h3></div><div className="movement-list">{movements.map((movement) => <article key={`${movement.sku}-${movement.created_at}-${movement.movement_type}`} className="movement"><div><strong>{movement.movement_type.replace("_", " ")}</strong><p>{movement.sku}</p></div><div><span>{movement.quantity} units</span><p>{movement.warehouse_code}</p></div></article>)}</div></section></section> : null}

        {activeView === "devops" ? <section className="section-stack"><section className="metrics"><MetricCard label="Docker Services" value={4} /><MetricCard label="CI Checks" value={5} /><MetricCard label="Terraform Layers" value={2} /><MetricCard label="Target Stage" value={"kind"} /></section><section className="panel-grid"><section className="panel"><div className="section-heading"><span className="section-tag">Automation</span><h3>Pipeline Map</h3></div><div className="ops-list"><article><strong>1. Local Build</strong><p>`docker compose up --build` boots the whole stack.</p></article><article><strong>2. Smoke Tests</strong><p>`make smoke` validates frontend, API, and database connectivity.</p></article><article><strong>3. CI Workflow</strong><p>GitHub Actions builds, scans with Trivy, starts Docker, and checks Terraform.</p></article><article><strong>4. Deployment Path</strong><p>Helm packages the app and Argo CD definitions prepare GitOps delivery.</p></article></div></section><section className="panel"><div className="section-heading"><span className="section-tag">Security</span><h3>Access Model</h3></div><div className="roadmap"><div className="roadmap-item current"><span>Admin</span><strong>Create, adjust, and delete</strong></div><div className="roadmap-item"><span>Manager</span><strong>Create and adjust stock</strong></div><div className="roadmap-item"><span>Viewer</span><strong>Read-only dashboard access</strong></div><div className="roadmap-item"><span>Next</span><strong>Move auth users into the database</strong></div></div></section></section></section> : null}
      </section>
    </main>
  );
}

function MetricCard({ label, value }) {
  return <article><span>{label}</span><strong>{value}</strong></article>;
}

function InfoPill({ label, value }) {
  return <article className="info-pill"><span>{label}</span><strong>{value}</strong></article>;
}

function getViewFromHash(hash) {
  const route = hash.replace(/^#\/?/, "");
  return NAV_ITEMS.some((item) => item.id === route) ? route : "overview";
}

function getInitialView() {
  if (typeof window === "undefined") return "overview";
  return getViewFromHash(window.location.hash);
}

function navigateTo(view) {
  window.location.hash = `/${view}`;
}

function loadSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("inventory_session");
  return raw ? JSON.parse(raw) : null;
}

function saveSession(session) {
  window.localStorage.setItem("inventory_session", JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem("inventory_session");
}
