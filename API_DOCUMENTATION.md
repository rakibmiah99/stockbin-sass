# Stockbin API Documentation

## General

- Base URL: `{{base_url}}/api`
- Authentication: Laravel Sanctum Bearer token (`Authorization: Bearer {{token}}`)
- Content type for JSON: `application/json`
- File uploads: `multipart/form-data` (images are compressed and stored as WebP at 90% quality)
- Most responses return HTTP `200` (including creates); use `success` to determine the result. Missing/invalid Bearer token returns HTTP `401` with `errors: "Unauthenticated."`
- Every success envelope includes a meaningful `message` string; errors set `message` to `null`
- **Exception:** invoice PDF (`/sale-invoices/{id}/pdf` and `/pdf/stream`) and report export endpoints (`/reports/*/export/pdf|excel`) return **binary** files (`application/pdf` or `.xlsx`), not the JSON envelope
- Resource payloads omit `created_at` / `updated_at`
- Protected routes require an active authenticated user and are tenant-scoped
- Public routes (no Bearer token): `/api/auth/*` (except logout) and `GET /api/app-versions`
- Inactive authenticated users are rejected (`Your account is inactive.`) and the current token is revoked
- Admin-only routes (`/users*`) require role `admin`
- Date-only fields (`expense_date`, `stock_date`, `payment_date`, `invoice_date`, `return_date`) use `YYYY-MM-DD`
- Timestamps are stored in UTC
- Passwords require **minimum 8 characters** only (no mixed-case / numbers / symbols rule)
- Password whitespace is preserved on register/login; trimmed on password reset, profile update, and admin user create/update
- User PIN is stored and returned as **plain text** (exactly 4 digits); profile/user payloads include both `pin` and `has_pin`
- Companion Postman collection: `postman/Stockbin-API-Admin.postman_collection.json`

### Roles

| Role | Access |
| --- | --- |
| `admin` | Full tenant access, including `/users*` management |
| `manager` | Same business APIs as salesman (not user admin) |
| `salesman` | Same business APIs as manager (not user admin) |

`role` on create/update managed users must be one of: `admin`, `salesman`, `manager`.

### Demo seed accounts

After `php artisan migrate:fresh --seed` (password `password`, PIN `1234` when `pin_login` is enabled):

| Email | Role |
| --- | --- |
| `admin@stockbin.test` | admin |
| `admin2@stockbin.test` | admin |
| `salesman@stockbin.test` | salesman |
| `manager@stockbin.test` | manager |

### Required headers

```http
Accept: application/json
Authorization: Bearer {{token}}
```

Public auth endpoints omit `Authorization`.

### X-Timezone

Send globally from the client:

```http
X-Timezone: Asia/Dhaka
```

Must be an IANA timezone. Missing or invalid values fall back to `UTC`.
Used by date filtering on:

- `GET /api/dashboard` (and dashboard tab lists where applicable)
- Report JSON + export routes under `/api/reports/...`
- `GET /api/customers`
- `GET /api/customers/{customer_id}/payments`
- `GET /api/expenses`
- `GET /api/product-stock-history`
- `GET /api/sale-invoices/draft`
- `GET /api/sale-invoices`
- `GET /api/sale-returns`
- `GET /api/sale-wastages`



### Date-filter contract


| `period`           | Meaning                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `last_100_records` | Default; latest 100 records (no date window)                     |
| `last_30_days`     | Last 30 calendar days including today                            |
| `last_60_days`     | Last 60 calendar days including today                            |
| `last_90_days`     | Last 90 calendar days including today                            |
| `custom`           | Requires `from_date` and `to_date`; range cannot exceed 120 days |


Example: `?period=custom&from_date=2026-05-01&to_date=2026-07-31`

### Standard envelopes

Success:

```JSON
{
  "success": true,
  "message": "Customers retrieved successfully.",
  "data": {},
  "errors": "No Errors"
}
```

Each endpoint returns its own meaningful `message` (for example: `Login successful.`, `Product created successfully.`).

Error:

```JSON
{
  "success": false,
  "message": null,
  "data": [],
  "errors": "Validation or authorization message"
}
```
Successful deletes and empty-success actions return `"data": null`.

---



## Authentication

API Name: Register Tenant Admin
API End Point: `POST /api/auth/register`
Request Payload JSON:

```JSON
{
  "name": "Stockbin Admin",
  "email": "admin@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "1|sanctum-token",
    "role": "admin"
  },
  "errors": "No Errors"
}
```

Creates a new tenant and its first active `admin`. Email is globally unique. Password requires minimum 8 characters (no complexity mix). Password whitespace is preserved; name/email are trimmed.

API Name: Login With Password
API End Point: `POST /api/auth/login`
Request Payload JSON:

```JSON
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "1|sanctum-token",
    "role": "admin",
    "shop_settings": {
      "id": 1,
      "tenant_id": 1,
      "shop_logo": "https://example.com/storage/shop-logos/logo.webp",
      "shop_name": "Stockbin Shop",
      "shop_email": "shop@example.com",
      "shop_phone": "01700000000",
      "shop_address": "Dhaka",
      "vat_percent": "15.00",
      "low_stock_threshold": 5,
      "currency_symbol": "৳",
      "invoice_type": "standard"
    }
  },
  "errors": "No Errors"
}
```

`shop_settings` is `null` when the tenant has no settings yet (e.g. fresh registration). Inactive users and users under inactive tenants cannot log in. Email is trimmed; password whitespace is preserved.

API Name: Login With PIN
API End Point: `POST /api/auth/pin-login`
Request Payload JSON:

```JSON
{
  "email": "admin@example.com",
  "pin": "1234"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "PIN login successful.",
  "data": {
    "token": "1|sanctum-token",
    "role": "salesman",
    "shop_settings": {
      "id": 1,
      "tenant_id": 1,
      "shop_logo": "https://example.com/storage/shop-logos/logo.webp",
      "shop_name": "Stockbin Shop",
      "shop_email": "shop@example.com",
      "shop_phone": "01700000000",
      "shop_address": "Dhaka",
      "vat_percent": "15.00",
      "low_stock_threshold": 5,
      "currency_symbol": "৳",
      "invoice_type": "standard"
    }
  },
  "errors": "No Errors"
}
```

`shop_settings` is `null` when the tenant has no settings yet. PIN must be exactly 4 digits, stored/compared as plain text, must be set on the user, and `pin_login` must be enabled.

API Name: Forgot Password Send OTP
API End Point: `POST /api/auth/forgot-password`
Request Payload JSON:

```JSON
{
  "email": "admin@example.com"
}
```

Response Payload JSON (success — active user found):

```JSON
{
  "success": true,
  "message": "Password reset OTP sent successfully.",
  "data": null,
  "errors": "No Errors"
}
```

Response Payload JSON (unknown email):

```JSON
{
  "success": false,
  "message": null,
  "data": [],
  "errors": "We could not find a user with that email address."
}
```

Response Payload JSON (inactive user):

```JSON
{
  "success": false,
  "message": null,
  "data": [],
  "errors": "Your account is inactive."
}
```

OTP is only created and emailed when the email belongs to an active user. Current OTP value is always `0000`, expires in **10 minutes**, and allows max **5** failed verify attempts. Requires a queue worker (`php artisan queue:work`) when mail is queued.

API Name: Verify Password Reset OTP
API End Point: `POST /api/auth/verify-otp`
Request Payload JSON:

```JSON
{
  "email": "admin@example.com",
  "otp": "0000"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "OTP verified successfully.",
  "data": null,
  "errors": "No Errors"
}
```

`otp` must be exactly 4 characters (`size:4`). Must succeed before reset. Invalid OTP increments attempts; expired OTP or too many attempts returns HTTP `200` with `success: false`.

API Name: Reset Password
API End Point: `POST /api/auth/reset-password`
Request Payload JSON:

```JSON
{
  "email": "admin@example.com",
  "otp": "0000",
  "password": "new-password",
  "password_confirmation": "new-password"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Password reset successfully.",
  "data": null,
  "errors": "No Errors"
}
```

OTP must already be verified. Password and confirmation are trimmed. Successful reset deletes OTP rows for that email and revokes all Sanctum tokens for the user. New password requires minimum 8 characters (no complexity mix).

API Name: Logout
API End Point: `POST /api/auth/logout`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Logout successful.",
  "data": null,
  "errors": "No Errors"
}
```

Requires Bearer token. Revokes **only the current** Sanctum token (other device sessions stay signed in).

---



## App Versions

Global mobile app version configuration (not tenant-scoped). Used by the StockBin Flutter app on startup to compare the local build number against `app_version_code`.

Seeded by `AppVersionSeeder` with a single default row (`app_version_code: 1`, `force_update: false`, `is_reviewer: false`).

API Name: List App Versions
API End Point: `GET /api/app-versions`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "App versions retrieved successfully.",
  "data": [
    {
      "id": 1,
      "app_version_code": 1,
      "force_update": false,
      "is_reviewer": false,
      "is_maintenance": false,
      "maintenance_msg": null
    }
  ],
  "errors": "No Errors"
}
```

Public — no `Authorization` header required. Results are ordered by `app_version_code` descending (latest first).

| Field | Type | Description |
| --- | --- | --- |
| `app_version_code` | integer | Minimum required mobile build number (e.g. `1` from Flutter `1.0.0+1`) |
| `force_update` | boolean | When `true`, clients below `app_version_code` must block usage until update |
| `is_reviewer` | boolean | Reviewer / app-store review mode flag |
| `is_maintenance` | boolean | When `true`, app should show maintenance screen and block usage |
| `maintenance_msg` | string or null | Message to display during maintenance mode |

---

## Dashboard

Home-screen overview for the authenticated tenant. Uses `X-Timezone` for “today” and period windows.

| Action | Endpoint |
| --- | --- |
| Overview | `GET /api/dashboard?period=last_7_days` |

### Period values

| `period` | Meaning | Chart buckets |
| --- | --- | --- |
| `today` | Current local calendar day | 24 hourly points (0–23) |
| `last_7_days` | Today and the previous 6 days (**default**) | 7 daily points |
| `last_30_days` | Today and the previous 29 days | 30 daily points |
| `last_60_days` | Today and the previous 59 days | 60 daily points |
| `last_90_days` | Today and the previous 89 days | 90 daily points |

Missing day/hour buckets are filled with `0`.

API Name: Dashboard Overview  
API End Point: `GET /api/dashboard?period=last_7_days`

Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Dashboard data retrieved successfully.",
  "data": {
    "period": "last_7_days",
    "from_date": "2026-07-24",
    "to_date": "2026-07-30",
    "sales": {
      "value": "1000.00",
      "trend_percent": 18.6,
      "chart": [0, 0, 0, 0, 1000, 0, 0]
    },
    "profit": {
      "value": "600.00",
      "trend_percent": 12.3,
      "chart": [0, 0, 0, 0, 600, 0, 0]
    },
    "due": {
      "value": "750.50",
      "customer_count": 2,
      "chart": null
    },
    "expenses": {
      "value": "150.00",
      "trend_percent": -4.2,
      "chart": [0, 0, 150, 0, 0, 0, 0]
    },
    "returns": {
      "value": "80.00",
      "trend_percent": null,
      "chart": [0, 0, 0, 0, 0, 80, 0]
    },
    "vat_collected": {
      "value": "50.00",
      "trend_percent": 8.4,
      "chart": [0, 0, 0, 0, 50, 0, 0]
    },
    "completed_orders": 1,
    "draft_orders": 1,
    "low_stock_count": 0
  },
  "errors": "No Errors"
}
```

Requires Bearer token. Money fields are strings with 2 decimals.

| Field | Description |
| --- | --- |
| `sales` | Sum of `grand_total` for completed invoices in the period |
| `profit` | `sales − Σ(purchase_cost_total)` on those invoice items |
| `vat_collected` | Sum of `vat_amount` for completed invoices |
| `expenses` | Sum of expense `amount` by `expense_date` |
| `returns` | Sum of return `refund_amount` by `return_date` |
| `due` | Current customer dues (`total_due > 0`); not period-scoped; `chart` is always `null` |
| `trend_percent` | % change vs the previous equal-length window; `null` when previous total is `0` |
| `chart` | Sparkline points (left = oldest, right = newest) |
| `completed_orders` / `draft_orders` | Invoice counts in the period by `invoice_status` |
| `low_stock_count` | Products where remaining qty ≤ shop `low_stock_threshold` |

---

## Dashboard Tab Lists

Home tab content. **No date / period filter.** Each endpoint returns at most **5** items plus a total `count`. Logic lives only in `DashboardService` (does not call other feature services).

| Action | Endpoint |
| --- | --- |
| Low stock | `GET /api/dashboard/low-stock` |
| Recent invoices | `GET /api/dashboard/invoices` |
| Due customers | `GET /api/dashboard/due-customers` |
| Recent expenses | `GET /api/dashboard/expenses` |

### Low stock

API Name: Dashboard Low Stock  
API End Point: `GET /api/dashboard/low-stock`

```JSON
{
  "success": true,
  "message": "Dashboard low stock retrieved successfully.",
  "data": {
    "count": 12,
    "items": [
      {
        "product_id": 2,
        "product_name": "Low Stock Shirt",
        "product_code": "PRD-0002",
        "remaining_qty": 5,
        "price": "800.00",
        "unit": "pcs",
        "stock_alert": true
      }
    ]
  },
  "errors": "No Errors"
}
```

Ordered by lowest `remaining_qty` first. `count` is the full low-stock total; `items` max 5.

### Invoices

API Name: Dashboard Invoices  
API End Point: `GET /api/dashboard/invoices`

Latest **completed** invoices only (drafts excluded). Newest `invoice_date` first. Max 5 items.

```JSON
{
  "success": true,
  "message": "Dashboard invoices retrieved successfully.",
  "data": {
    "count": 40,
    "items": [
      {
        "id": 1,
        "invoice_no": "INV-20260729-0005",
        "invoice_date": "2026-07-29",
        "grand_total": "1186.50",
        "due_amount": "936.00",
        "payment_status": "partial",
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678"
      }
    ]
  },
  "errors": "No Errors"
}
```

### Due customers

API Name: Dashboard Due Customers  
API End Point: `GET /api/dashboard/due-customers`

Customers with `total_due > 0`, highest due first. Max 5 items.

```JSON
{
  "success": true,
  "message": "Dashboard due customers retrieved successfully.",
  "data": {
    "count": 8,
    "items": [
      {
        "id": 1,
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678",
        "total_due": "750.00"
      }
    ]
  },
  "errors": "No Errors"
}
```

### Expenses

API Name: Dashboard Expenses  
API End Point: `GET /api/dashboard/expenses`

Latest expenses by `expense_date` (no date window). Max 5 items.

```JSON
{
  "success": true,
  "message": "Dashboard expenses retrieved successfully.",
  "data": {
    "count": 25,
    "items": [
      {
        "id": 1,
        "title": "Shop Rent",
        "amount": "15000.00",
        "expense_date": "2026-07-28",
        "category": "Rent"
      }
    ]
  },
  "errors": "No Errors"
}
```

---

## Reports

Flutter Reports screens. Tenant-scoped. Uses `X-Timezone` for period windows. Dedicated `ReportService` (does not reuse `DashboardService`).

| Report | Endpoint |
| --- | --- |
| Sales | `GET /api/reports/sales` |
| Sales PDF export | `GET /api/reports/sales/export/pdf` |
| Sales Excel export | `GET /api/reports/sales/export/excel` |
| Profit Loss | `GET /api/reports/profit-loss` |
| Profit Loss PDF export | `GET /api/reports/profit-loss/export/pdf` |
| Profit Loss Excel export | `GET /api/reports/profit-loss/export/excel` |
| Due | `GET /api/reports/due` |
| Due PDF export | `GET /api/reports/due/export/pdf` |
| Due Excel export | `GET /api/reports/due/export/excel` |
| Stock | `GET /api/reports/stock` |
| Stock PDF export | `GET /api/reports/stock/export/pdf` |
| Stock Excel export | `GET /api/reports/stock/export/excel` |
| Expense | `GET /api/reports/expenses` |
| Expense PDF export | `GET /api/reports/expenses/export/pdf` |
| Expense Excel export | `GET /api/reports/expenses/export/excel` |

### Period values

| `period` | Meaning |
| --- | --- |
| `today` | Current local calendar day |
| `last_7_days` | Today + previous 6 days (**default**) |
| `last_30_days` | Today + previous 29 days |
| `last_60_days` | Today + previous 59 days |
| `last_90_days` | Today + previous 89 days |
| `custom` | Requires `from_date` + `to_date` (`Y-m-d`); **max 120 days** inclusive |

Query examples: `?period=last_7_days` · `?period=custom&from_date=2026-07-01&to_date=2026-07-15`

**Date-scoped:** Sales, Profit Loss, Expense.  
**Snapshot (period echoed for UI only):** Due, Stock.

**List caps:** Due items / Stock low-stock items / Expense recent_items → **100**. KPI counts are full snapshots.

**Chart:** Sales & P&L use `{ label, value }` points — `today` = 24 hourly; other periods = one point per day.  
**P&L formula:** `net_profit = sales − COGS − expenses` (`COGS = Σ purchase_cost_total` on completed invoice items).

API Name: Sales Report  
API End Point: `GET /api/reports/sales?period=last_7_days`

Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sales report retrieved successfully.",
  "data": {
    "period": "last_7_days",
    "from_date": "2026-07-24",
    "to_date": "2026-07-30",
    "total_sales": "158750.00",
    "total_orders": 245,
    "chart_granularity": "daily",
    "chart": [
      { "label": "Jul 24", "value": 12000 },
      { "label": "Jul 30", "value": 25750 }
    ]
  },
  "errors": "No Errors"
}
```

API Name: Sales Report PDF Export  
API End Point: `GET /api/reports/sales/export/pdf?period=last_30_days`  
Auth: Bearer token. Same period query as Sales Report.  
Response: binary `application/pdf` download (`Sales-Report-{from}-to-{to}.pdf`). Product-wise line rows (max 2000). KPIs: Total Sales, Total Discount, Orders. No JSON Resource.

API Name: Sales Report Excel Export  
API End Point: `GET /api/reports/sales/export/excel?period=last_30_days`  
Auth: Bearer token. Same period query as Sales Report.  
Response: binary `.xlsx` download (`Sales-Report-{from}-to-{to}.xlsx`). Same columns/KPIs as PDF.

API Name: Profit Loss Report  
API End Point: `GET /api/reports/profit-loss?period=last_7_days`

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Profit loss report retrieved successfully.",
  "data": {
    "period": "last_7_days",
    "from_date": "2026-07-24",
    "to_date": "2026-07-30",
    "total_sales": "158750.00",
    "total_expense": "48200.00",
    "net_profit": "110550.00",
    "chart": [
      { "label": "Jul 24", "value": 7200 },
      { "label": "Jul 30", "value": 17550 }
    ]
  },
  "errors": "No Errors"
}
```

API Name: Profit Loss Report PDF Export  
API End Point: `GET /api/reports/profit-loss/export/pdf?period=last_30_days`  
Auth: Bearer token. Same period query as Profit Loss Report (date-scoped).  
Response: binary `application/pdf` download (`Profit-Loss-Report-{from}-to-{to}.pdf`).  
Summary KPIs: Total Sales, COGS, Gross Profit, Total Expense, Net Profit.  
Breakdown rows match chart granularity (`today` = hourly, else daily): Label, Sales, COGS, Expenses, Net.  
Formula: `net = sales − COGS − expenses` (`COGS = Σ purchase_cost_total` on completed invoice items).

API Name: Profit Loss Report Excel Export  
API End Point: `GET /api/reports/profit-loss/export/excel?period=last_30_days`  
Auth: Bearer token. Same filters/columns/KPIs as PDF.  
Response: binary `.xlsx` download (`Profit-Loss-Report-{from}-to-{to}.xlsx`).

API Name: Due Report  
API End Point: `GET /api/reports/due?period=last_7_days`

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Due report retrieved successfully.",
  "data": {
    "period": "last_7_days",
    "from_date": "2026-07-24",
    "to_date": "2026-07-30",
    "total_due": "45200.00",
    "customer_count": 18,
    "items": [
      {
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678",
        "total_due": "12500.00"
      }
    ]
  },
  "errors": "No Errors"
}
```

API Name: Due Report PDF Export  
API End Point: `GET /api/reports/due/export/pdf?period=last_30_days`  
Auth: Bearer token. Same period query as Due Report (period echoed for header; outstanding dues are a snapshot).  
Response: binary `application/pdf` download (`Due-Report-{from}-to-{to}.pdf`). Invoice-wise rows (`due_amount > 0`, status `completed`/`returned`, max 2000). Columns: Invoice No, Date, Customer, Mobile, Due Amount. KPIs: Total Due, Due Invoices.

API Name: Due Report Excel Export  
API End Point: `GET /api/reports/due/export/excel?period=last_30_days`  
Auth: Bearer token. Same filters/columns/KPIs as PDF.  
Response: binary `.xlsx` download (`Due-Report-{from}-to-{to}.xlsx`).

API Name: Stock Report  
API End Point: `GET /api/reports/stock?period=last_7_days`

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Stock report retrieved successfully.",
  "data": {
    "period": "last_7_days",
    "from_date": "2026-07-24",
    "to_date": "2026-07-30",
    "low_stock_count": 12,
    "stock_value": "485000.00",
    "items": [
      {
        "product_name": "Cotton Shirt XL",
        "remaining_qty": 3,
        "price": "800.00",
        "unit": "pcs"
      }
    ]
  },
  "errors": "No Errors"
}
```

API Name: Stock Report PDF Export  
API End Point: `GET /api/reports/stock/export/pdf?period=last_30_days`  
Auth: Bearer token. Period is **date-scoped** for movement totals (unlike JSON Stock snapshot).  
Response: binary `application/pdf` (`Stock-Report-{from}-to-{to}.pdf`).  
Product-wise rows (max 2000): Date (as-of `to_date`), Product, Category, Color, Size, Weight, Unit, Stock total (period stock in), Qty sale, Qty refund (restocked), Qty wastage, Remaining qty (current).  
KPIs: Products, Stock in, Qty sale, Qty refund, Qty wastage, Remaining.

API Name: Stock Report Excel Export  
API End Point: `GET /api/reports/stock/export/excel?period=last_30_days`  
Auth: Bearer token. Same filters/columns/KPIs as PDF.  
Response: binary `.xlsx` (`Stock-Report-{from}-to-{to}.xlsx`).

API Name: Expense Report  
API End Point: `GET /api/reports/expenses?period=last_7_days`

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense report retrieved successfully.",
  "data": {
    "period": "last_7_days",
    "from_date": "2026-07-24",
    "to_date": "2026-07-30",
    "total_expense": "37500.00",
    "category_count": 5,
    "categories": [
      { "name": "Rent", "amount": "15000.00", "percent": 40 },
      { "name": "Transport", "amount": "8000.00", "percent": 21.3 }
    ],
    "recent_items": [
      {
        "title": "Shop Rent July",
        "category": "Rent",
        "amount": "15000.00",
        "expense_date": "2026-07-28"
      }
    ]
  },
  "errors": "No Errors"
}
```

API Name: Expense Report PDF Export  
API End Point: `GET /api/reports/expenses/export/pdf?period=last_30_days`  
Auth: Bearer token. Same period query as Expense Report (date-scoped).  
Response: binary `application/pdf` download (`Expense-Report-{from}-to-{to}.pdf`). Expense-line rows (max 2000). Columns: Date, Title, Category, Amount. KPIs: Total Expense, Categories, Expenses.

API Name: Expense Report Excel Export  
API End Point: `GET /api/reports/expenses/export/excel?period=last_30_days`  
Auth: Bearer token. Same filters/columns/KPIs as PDF.  
Response: binary `.xlsx` download (`Expense-Report-{from}-to-{to}.xlsx`).

---



## Authenticated User Profile

API Name: Get Authenticated Profile
API End Point: `GET /api/user`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Profile retrieved successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Stockbin Admin",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true,
    "pin_login": true,
    "pin": "1234",
    "has_pin": true
  },
  "errors": "No Errors"
}
```

This GET endpoint has no body. Use empty `{}` as the request payload and send only headers (`Accept`, `Authorization`). Response includes plain-text `pin` and `has_pin`.

API Name: Update Authenticated Profile
API End Point: `PUT /api/user`
Request Payload JSON:

```JSON
{
  "name": "Updated Admin",
  "email": "updated@example.com",
  "password": "new-password",
  "password_confirmation": "new-password",
  "pin": "5678",
  "pin_confirmation": "5678",
  "pin_login": true,
  "notification_id": "device-token",
  "geo_locations": "23.8103,90.4125",
  "ip_address": "203.0.113.10"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Updated Admin",
    "email": "updated@example.com",
    "role": "admin",
    "is_active": true,
    "pin_login": true,
    "pin": "5678",
    "has_pin": true
  },
  "errors": "No Errors"
}
```

All fields are optional. Password requires minimum 8 characters (no complexity mix) and is trimmed. PIN must be **exactly 4 digits**, stored/returned as plain text. `pin_login: true` requires an existing PIN or a PIN in the same request. `notification_id`, `geo_locations`, and `ip_address` are write-only (not returned in the profile resource).

---



## Tenant User Management (Admin Only)

Requires `auth:sanctum` + `active` + `admin`. Managers and salesmen receive `403` on these routes.

API Name: List Tenant Users
API End Point: `GET /api/users`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": [
    {
      "id": 4,
      "tenant_id": 1,
      "name": "Stockbin Manager",
      "email": "manager@stockbin.test",
      "role": "manager",
      "is_active": true,
      "pin_login": true,
      "pin": "1234",
      "has_pin": true
    },
    {
      "id": 2,
      "tenant_id": 1,
      "name": "Rahim Sales",
      "email": "rahim@example.com",
      "role": "salesman",
      "is_active": true,
      "pin_login": false,
      "pin": null,
      "has_pin": false
    }
  ],
  "errors": "No Errors"
}
```

No query parameters. Returns all users for the authenticated admin tenant (`admin`, `salesman`, and `manager`), ordered by newest `created_at` first. User payloads include plain-text `pin` and `has_pin`.

API Name: Create Tenant User
API End Point: `POST /api/users`
Request Payload JSON:

```JSON
{
  "name": "Shop Salesman",
  "email": "salesman@example.com",
  "password": "password",
  "password_confirmation": "password",
  "role": "salesman",
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 2,
    "tenant_id": 1,
    "name": "Shop Salesman",
    "email": "salesman@example.com",
    "role": "salesman",
    "is_active": true,
    "pin_login": false,
    "pin": null,
    "has_pin": false
  },
  "errors": "No Errors"
}
```

`tenant_id` is taken from the authenticated admin. Email is globally unique. Password requires minimum 8 characters (no complexity mix). `role` must be `admin`, `salesman`, or `manager`. `is_active` is optional (defaults per factory/service). Response includes `pin` (usually `null`) and `has_pin`.

API Name: Create Tenant Manager
API End Point: `POST /api/users`
Request Payload JSON:

```JSON
{
  "name": "Shop Manager",
  "email": "manager@example.com",
  "password": "password",
  "password_confirmation": "password",
  "role": "manager",
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 3,
    "tenant_id": 1,
    "name": "Shop Manager",
    "email": "manager@example.com",
    "role": "manager",
    "is_active": true,
    "pin_login": false,
    "pin": null,
    "has_pin": false
  },
  "errors": "No Errors"
}
```

Same create contract as Create Tenant User with `role: "manager"`. Managers share business APIs with salesmen; only `/users*` requires `admin`.

API Name: Get Managed User
API End Point: `GET /api/users/{user_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "User retrieved successfully.",
  "data": {
    "id": 2,
    "tenant_id": 1,
    "name": "Shop Salesman",
    "email": "salesman@example.com",
    "role": "salesman",
    "is_active": true,
    "pin_login": false,
    "pin": null,
    "has_pin": false
  },
  "errors": "No Errors"
}
```

API Name: Update Managed User
API End Point: `PUT /api/users/{user_id}`
Request Payload JSON:

```JSON
{
  "name": "Updated Salesman",
  "email": "updated-salesman@example.com",
  "role": "salesman",
  "password": "new-password",
  "password_confirmation": "new-password"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "id": 2,
    "tenant_id": 1,
    "name": "Updated Salesman",
    "email": "updated-salesman@example.com",
    "role": "salesman",
    "is_active": true,
    "pin_login": false,
    "pin": null,
    "has_pin": false
  },
  "errors": "No Errors"
}
```

All fields are optional (`sometimes`). When sent, `role` must be `admin`, `salesman`, or `manager`. Password is optional; when sent it requires minimum 8 characters (no complexity mix) and confirmation. Cannot demote or remove the last active admin.

API Name: Update Managed User Status
API End Point: `PATCH /api/users/{user_id}/status`
Request Payload JSON:

```JSON
{
  "is_active": false
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "User status updated successfully.",
  "data": {
    "id": 2,
    "tenant_id": 1,
    "name": "Updated Salesman",
    "email": "updated-salesman@example.com",
    "role": "salesman",
    "is_active": false,
    "pin_login": false,
    "pin": null,
    "has_pin": false
  },
  "errors": "No Errors"
}
```

Deactivation revokes the user's tokens. An admin cannot deactivate their own account, and a tenant must retain at least one active admin.

API Name: Delete Managed User
API End Point: `DELETE /api/users/{user_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "User deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

An admin cannot delete their own account, and a tenant must retain at least one active admin.

---



## Shop Settings

Only one settings row is allowed per tenant.

API Name: Get Shop Settings
API End Point: `GET /api/shop-settings`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Shop settings retrieved successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "shop_logo": "https://example.com/storage/shop-logos/logo.webp",
    "shop_name": "Stockbin Shop",
    "shop_email": "shop@example.com",
    "shop_phone": "01700000000",
    "shop_address": "Dhaka",
    "vat_percent": "15.00",
    "low_stock_threshold": 5,
    "currency_symbol": "৳",
    "invoice_type": "standard"
  },
  "errors": "No Errors"
}
```

API Name: Create Shop Settings
API End Point: `POST /api/shop-settings`
Request Payload JSON:

```JSON
{
  "shop_logo": "<file>",
  "shop_name": "Stockbin Shop",
  "shop_email": "shop@example.com",
  "shop_phone": "01700000000",
  "shop_address": "Dhaka",
  "vat_percent": 15,
  "low_stock_threshold": 5,
  "currency_symbol": "৳",
  "invoice_type": "standard"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Shop settings created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "shop_logo": "https://example.com/storage/shop-logos/logo.webp",
    "shop_name": "Stockbin Shop",
    "shop_email": "shop@example.com",
    "shop_phone": "01700000000",
    "shop_address": "Dhaka",
    "vat_percent": "15.00",
    "low_stock_threshold": 5,
    "currency_symbol": "৳",
    "invoice_type": "standard"
  },
  "errors": "No Errors"
}
```

Use `multipart/form-data` when uploading `shop_logo`. Required: `vat_percent`, `low_stock_threshold`, `currency_symbol`, `invoice_type` (`standard`|`thermal`). Logo optional; allowed upload types png/jpg/jpeg/webp/gif, max 2 MB. Uploaded images are compressed and stored as **WebP (quality 90%)**.

API Name: Update Shop Settings (JSON)
API End Point: `PUT /api/shop-settings`
Request Payload JSON:

```JSON
{
  "shop_name": "Stockbin Shop Updated",
  "shop_email": "shop@example.com",
  "shop_phone": "01700000000",
  "shop_address": "Dhaka",
  "vat_percent": 15,
  "low_stock_threshold": 5,
  "currency_symbol": "৳",
  "invoice_type": "thermal"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Shop settings updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "shop_logo": "https://example.com/storage/shop-logos/logo.webp",
    "shop_name": "Stockbin Shop Updated",
    "shop_email": "shop@example.com",
    "shop_phone": "01700000000",
    "shop_address": "Dhaka",
    "vat_percent": "15.00",
    "low_stock_threshold": 5,
    "currency_symbol": "৳",
    "invoice_type": "thermal"
  },
  "errors": "No Errors"
}
```

API Name: Update Shop Settings (Multipart)
API End Point: `POST /api/shop-settings/update`
Request Payload JSON:

```JSON
{
  "shop_logo": "<file>",
  "shop_name": "Stockbin Shop Updated",
  "shop_email": "shop@example.com",
  "shop_phone": "01700000000",
  "shop_address": "Dhaka",
  "vat_percent": 15,
  "low_stock_threshold": 5,
  "currency_symbol": "৳",
  "invoice_type": "standard"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Shop settings updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "shop_logo": "https://example.com/storage/shop-logos/logo.webp",
    "shop_name": "Stockbin Shop Updated",
    "shop_email": "shop@example.com",
    "shop_phone": "01700000000",
    "shop_address": "Dhaka",
    "vat_percent": "15.00",
    "low_stock_threshold": 5,
    "currency_symbol": "৳",
    "invoice_type": "standard"
  },
  "errors": "No Errors"
}
```

Use `multipart/form-data` for this alternate update path when uploading a logo.

---



## Colors

`color_name` is unique per tenant.

API Name: List Colors
API End Point: `GET /api/colors`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Colors retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "color_name": "Midnight Blue"
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Color
API End Point: `POST /api/colors`
Request Payload JSON:

```JSON
{
  "color_name": "Midnight Blue"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Color created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "color_name": "Midnight Blue"
  },
  "errors": "No Errors"
}
```

API Name: Update Color
API End Point: `PUT /api/colors/{color_id}`
Request Payload JSON:

```JSON
{
  "color_name": "Ocean Blue"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Color updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "color_name": "Ocean Blue"
  },
  "errors": "No Errors"
}
```

API Name: Delete Color
API End Point: `DELETE /api/colors/{color_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Color deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Product Units

`unit_name` is unique per tenant.

API Name: List Product Units
API End Point: `GET /api/product-units`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product units retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "unit_name": "pcs"
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Product Unit
API End Point: `POST /api/product-units`
Request Payload JSON:

```JSON
{
  "unit_name": "pcs"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product unit created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "unit_name": "pcs"
  },
  "errors": "No Errors"
}
```

API Name: Update Product Unit
API End Point: `PUT /api/product-units/{product_unit_id}`
Request Payload JSON:

```JSON
{
  "unit_name": "box"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product unit updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "unit_name": "box"
  },
  "errors": "No Errors"
}
```

API Name: Delete Product Unit
API End Point: `DELETE /api/product-units/{product_unit_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product unit deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Sizes

`size_name` is unique per tenant.

API Name: List Sizes
API End Point: `GET /api/sizes`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sizes retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "size_name": "XL"
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Size
API End Point: `POST /api/sizes`
Request Payload JSON:

```JSON
{
  "size_name": "XL"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Size created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "size_name": "XL"
  },
  "errors": "No Errors"
}
```

API Name: Update Size
API End Point: `PUT /api/sizes/{size_id}`
Request Payload JSON:

```JSON
{
  "size_name": "XXL"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Size updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "size_name": "XXL"
  },
  "errors": "No Errors"
}
```

API Name: Delete Size
API End Point: `DELETE /api/sizes/{size_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Size deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Weights

`weight_name` is unique per tenant.

API Name: List Weights
API End Point: `GET /api/weights`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Weights retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "weight_name": "1kg"
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Weight
API End Point: `POST /api/weights`
Request Payload JSON:

```JSON
{
  "weight_name": "1kg"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Weight created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "weight_name": "1kg"
  },
  "errors": "No Errors"
}
```

API Name: Update Weight
API End Point: `PUT /api/weights/{weight_id}`
Request Payload JSON:

```JSON
{
  "weight_name": "500g"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Weight updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "weight_name": "500g"
  },
  "errors": "No Errors"
}
```

API Name: Delete Weight
API End Point: `DELETE /api/weights/{weight_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Weight deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Categories

`total_product` is computed from related products (`withCount`) and is not stored on the categories table.

API Name: List Categories
API End Point: `GET /api/categories`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "name": "Electronics",
      "image": "https://example.com/storage/categories/image.webp",
      "sort_order": 0,
      "total_product": 10
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Category
API End Point: `POST /api/categories`
Request Payload JSON:

```JSON
{
  "name": "Electronics",
  "image": "<file>"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Electronics",
    "image": "https://example.com/storage/categories/image.webp",
    "sort_order": 0,
    "total_product": 0
  },
  "errors": "No Errors"
}
```

Use `multipart/form-data` when uploading `image`. Image optional; allowed upload types png/jpg/jpeg/webp/gif, max 2 MB. Uploaded images are compressed and stored as **WebP (quality 90%)**.

API Name: Sort Categories
API End Point: `PUT /api/categories/sort`
Request Payload JSON:

```JSON
{
  "order": [3, 1, 2]
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Category sort order updated successfully.",
  "data": [
    {
      "id": 3,
      "tenant_id": 1,
      "name": "Fashion",
      "image": null,
      "sort_order": 0,
      "total_product": 5
    },
    {
      "id": 1,
      "tenant_id": 1,
      "name": "Electronics",
      "image": "https://example.com/storage/categories/image.webp",
      "sort_order": 1,
      "total_product": 10
    },
    {
      "id": 2,
      "tenant_id": 1,
      "name": "Grocery",
      "image": null,
      "sort_order": 2,
      "total_product": 2
    }
  ],
  "errors": "No Errors"
}
```

IDs must be distinct and belong to the authenticated tenant.

API Name: Update Category (JSON)
API End Point: `PUT /api/categories/{category_id}`
Request Payload JSON:

```JSON
{
  "name": "Electronics Updated"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Category updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Electronics Updated",
    "image": "https://example.com/storage/categories/image.webp",
    "sort_order": 0,
    "total_product": 10
  },
  "errors": "No Errors"
}
```

API Name: Update Category (Multipart)
API End Point: `POST /api/categories/{category_id}/update`
Request Payload JSON:

```JSON
{
  "name": "Electronics Updated",
  "image": "<file>"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Category updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Electronics Updated",
    "image": "https://example.com/storage/categories/image.webp",
    "sort_order": 0,
    "total_product": 10
  },
  "errors": "No Errors"
}
```

Use `multipart/form-data` for this alternate update path when uploading an image.

API Name: Delete Category
API End Point: `DELETE /api/categories/{category_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Category deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Expense Categories

`name` is unique per tenant. A category referenced by expenses cannot be deleted.

API Name: List Expense Categories
API End Point: `GET /api/expense-categories`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense categories retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "name": "Shop Rent",
      "description": "Monthly rent",
      "is_active": true,
      "sort_order": 0
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Expense Category
API End Point: `POST /api/expense-categories`
Request Payload JSON:

```JSON
{
  "name": "Office Rent",
  "description": "Monthly office rent",
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense category created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Office Rent",
    "description": "Monthly office rent",
    "is_active": true,
    "sort_order": 0
  },
  "errors": "No Errors"
}
```

API Name: Sort Expense Categories
API End Point: `PUT /api/expense-categories/sort`
Request Payload JSON:

```JSON
{
  "order": [2, 1, 3]
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense category sort order updated successfully.",
  "data": [
    {
      "id": 2,
      "tenant_id": 1,
      "name": "Utilities",
      "description": null,
      "is_active": true,
      "sort_order": 0
    },
    {
      "id": 1,
      "tenant_id": 1,
      "name": "Office Rent",
      "description": "Monthly office rent",
      "is_active": true,
      "sort_order": 1
    },
    {
      "id": 3,
      "tenant_id": 1,
      "name": "Transport",
      "description": null,
      "is_active": true,
      "sort_order": 2
    }
  ],
  "errors": "No Errors"
}
```

API Name: Update Expense Category
API End Point: `PUT /api/expense-categories/{expense_category_id}`
Request Payload JSON:

```JSON
{
  "name": "Shop Rent",
  "description": "Updated description",
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense category updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "name": "Shop Rent",
    "description": "Updated description",
    "is_active": true,
    "sort_order": 0
  },
  "errors": "No Errors"
}
```

All fields are optional.

API Name: Delete Expense Category
API End Point: `DELETE /api/expense-categories/{expense_category_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense category deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Expenses

Filtering uses `expense_date`, with “today” from `X-Timezone`. Mobile aliases `category_id` / `date` are accepted on write in addition to `expense_category_id` / `expense_date`.

API Name: List Expenses
API End Point: `GET /api/expenses?period=last_100_records&expense_category_id=1`

Search example: `GET /api/expenses?search=rent`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expenses retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "expense_category_id": 1,
      "category_id": 1,
      "title": "June Shop Rent",
      "name": "June Shop Rent",
      "amount": "45000.50",
      "expense_date": "2026-07-19",
      "date": "2026-07-19",
      "note": "Paid by bank",
      "category": "Shop Rent",
      "expense_category": {
        "id": 1,
        "name": "Shop Rent",
        "description": null,
        "is_active": true,
        "sort_order": 0
      }
    }
  ],
  "errors": "No Errors"
}
```

Optional query: `period`, `from_date`, `to_date`, `expense_category_id` (alias `category_id`), `search`.

- `search`: case-insensitive match against `title` and `note` only (not category name); when provided it overrides and ignores all other filters (`period`, `expense_category_id`, `from_date`, `to_date`) and returns up to 100 matching tenant expenses; empty/omitted keeps the normal filtered list behavior below
- `last_100_records` (default): latest 100 expenses, without a date window
- `last_30_days`: today and the previous 29 calendar days
- `last_60_days`: today and the previous 59 calendar days
- `last_90_days`: today and the previous 89 calendar days
- `custom`: inclusive `from_date` through `to_date`, maximum 120 days

API Name: Create Expense
API End Point: `POST /api/expenses`
Request Payload JSON:

```JSON
{
  "expense_category_id": 1,
  "title": "June Shop Rent",
  "amount": 45000.5,
  "expense_date": "2026-07-19",
  "note": "Paid by bank"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "expense_category_id": 1,
    "category_id": 1,
    "title": "June Shop Rent",
    "name": "June Shop Rent",
    "amount": "45000.50",
    "expense_date": "2026-07-19",
    "date": "2026-07-19",
    "note": "Paid by bank",
    "category": "Shop Rent",
    "expense_category": {
      "id": 1,
      "name": "Shop Rent",
      "description": null,
      "is_active": true,
      "sort_order": 0
    }
  },
  "errors": "No Errors"
}
```

Alias body fields also accepted: `category_id`, `date`.

API Name: Update Expense
API End Point: `PUT /api/expenses/{expense_id}`
Request Payload JSON:

```JSON
{
  "expense_category_id": 1,
  "title": "July Shop Rent",
  "amount": 46000,
  "expense_date": "2026-07-20",
  "note": "Updated note"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "expense_category_id": 1,
    "category_id": 1,
    "title": "July Shop Rent",
    "name": "July Shop Rent",
    "amount": "46000.00",
    "expense_date": "2026-07-20",
    "date": "2026-07-20",
    "note": "Updated note",
    "category": "Shop Rent",
    "expense_category": {
      "id": 1,
      "name": "Shop Rent",
      "description": null,
      "is_active": true,
      "sort_order": 0
    }
  },
  "errors": "No Errors"
}
```

API Name: Delete Expense
API End Point: `DELETE /api/expenses/{expense_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Expense deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Products

`product_code` is auto-generated by the backend as `PRD-0001`, `PRD-0002`, … (unique per tenant). Clients must not send `product_code` on create or update; it is immutable after create.

API Name: List Products
API End Point: `GET /api/products`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "category_id": 1,
      "product_code": "PRD-0001",
      "product_name": "Premium T-Shirt",
      "product_image": null,
      "unit": "pcs",
      "color": "Blue",
      "size": "XL",
      "weight": "250g",
      "price": "1250.00",
      "position": 0,
      "is_active": true,
      "category": {
        "id": 1,
        "name": "Fashion"
      }
    }
  ],
  "errors": "No Errors"
}
```

API Name: Create Product
API End Point: `POST /api/products`
Request Payload JSON:

```JSON
{
  "category_id": 1,
  "product_name": "Premium T-Shirt",
  "product_image": "<file>",
  "unit": "pcs",
  "color": "Blue",
  "size": "XL",
  "weight": "250g",
  "price": 1250,
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "category_id": 1,
    "product_code": "PRD-0001",
    "product_name": "Premium T-Shirt",
    "product_image": "https://example.com/storage/products/image.webp",
    "unit": "pcs",
    "color": "Blue",
    "size": "XL",
    "weight": "250g",
    "price": "1250.00",
    "position": 0,
    "is_active": true,
    "category": {
      "id": 1,
      "name": "Fashion"
    }
  },
  "errors": "No Errors"
}
```

Use JSON without an image, or `multipart/form-data` when uploading `product_image` (optional; png/jpg/jpeg/webp/gif, max 2 MB). Uploaded images are compressed and stored as **WebP (quality 90%)**. `product_code` is assigned automatically (`PRD-0001`, then `PRD-0002`, …).

API Name: Sort Products
API End Point: `PUT /api/products/sort`
Request Payload JSON:

```JSON
{
  "order": [5, 2, 7]
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product sort order updated successfully.",
  "data": [
    {
      "id": 5,
      "tenant_id": 1,
      "category_id": 1,
      "product_code": "PRD-0005",
      "product_name": "Product Five",
      "product_image": null,
      "unit": "pcs",
      "color": null,
      "size": null,
      "weight": null,
      "price": "100.00",
      "position": 0,
      "is_active": true,
      "category": {
        "id": 1,
        "name": "Fashion"
      }
    }
  ],
  "errors": "No Errors"
}
```

IDs must be distinct and belong to the authenticated tenant.

API Name: Update Product (JSON)
API End Point: `PUT /api/products/{product_id}`
Request Payload JSON:

```JSON
{
  "category_id": 1,
  "product_name": "Premium T-Shirt Updated",
  "unit": "pcs",
  "color": "Blue",
  "size": "XL",
  "weight": "250g",
  "price": 1300,
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "category_id": 1,
    "product_code": "PRD-0001",
    "product_name": "Premium T-Shirt Updated",
    "product_image": null,
    "unit": "pcs",
    "color": "Blue",
    "size": "XL",
    "weight": "250g",
    "price": "1300.00",
    "position": 0,
    "is_active": true,
    "category": {
      "id": 1,
      "name": "Fashion"
    }
  },
  "errors": "No Errors"
}
```

`product_code` cannot be changed on update (omit it from the request).

API Name: Update Product (Multipart)
API End Point: `POST /api/products/{product_id}/update`
Request Payload JSON:

```JSON
{
  "category_id": 1,
  "product_name": "Premium T-Shirt Updated",
  "product_image": "<file>",
  "unit": "pcs",
  "color": "Blue",
  "size": "XL",
  "weight": "250g",
  "price": 1300,
  "is_active": true
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "category_id": 1,
    "product_code": "PRD-0001",
    "product_name": "Premium T-Shirt Updated",
    "product_image": "https://example.com/storage/products/image.webp",
    "unit": "pcs",
    "color": "Blue",
    "size": "XL",
    "weight": "250g",
    "price": "1300.00",
    "position": 0,
    "is_active": true,
    "category": {
      "id": 1,
      "name": "Fashion"
    }
  },
  "errors": "No Errors"
}
```

`product_code` cannot be changed on update (omit it from the request). Use `multipart/form-data` for this alternate update path when uploading an image.

API Name: Delete Product
API End Point: `DELETE /api/products/{product_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

A product cannot be deleted when stock records exist, or when it has already been used in a sale.

---



## Product Stocks

API Name: List Product Stock Summaries
API End Point: `GET /api/product-stocks`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product stocks retrieved successfully.",
  "data": [
    {
      "product_id": 1,
      "category_id": 1,
      "category_name": "Apparel",
      "product_code": "PRD-0001",
      "product_name": "Premium T-Shirt",
      "product_image": "https://example.com/storage/products/image.webp",
      "unit": "pcs",
      "color": "Blue",
      "size": "XL",
      "weight": "250g",
      "price": "1250.00",
      "total_qty": 150,
      "remaining_qty": 110,
      "stock_alert": false
    }
  ],
  "errors": "No Errors"
}
```

Products without stock batches are included with zero quantities. Results are ordered by lowest `remaining_qty` first. Each row includes `category_id` and `category_name`. `stock_alert` is `true` when `remaining_qty` is less than or equal to the tenant shop setting `low_stock_threshold` (defaults to `0` when settings are missing).

API Name: List Low-Stock Products
API End Point: `GET /api/product-stocks/low-stock`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Low stock products retrieved successfully.",
  "data": [
    {
      "product_id": 2,
      "category_id": 1,
      "category_name": "Apparel",
      "product_code": "PRD-0002",
      "product_name": "Low Stock Shirt",
      "product_image": "https://example.com/storage/products/image.webp",
      "unit": "pcs",
      "color": "Red",
      "size": "M",
      "weight": "200g",
      "price": "800.00",
      "total_qty": 8,
      "remaining_qty": 5,
      "stock_alert": true
    }
  ],
  "errors": "No Errors"
}
```

Alert-screen list: same summary shape as `GET /api/product-stocks` (including `category_id` and `category_name`), but only products where summed `remaining_qty <= low_stock_threshold` (including products with no stock batches / `remaining_qty = 0`). Ordered by lowest `remaining_qty` first. Threshold comes from shop settings (defaults to `0` when settings are missing). Every row has `stock_alert: true`. No pagination.

API Name: Create Product Stock Batch
API End Point: `POST /api/product-stocks`
Request Payload JSON:

```JSON
{
  "product_id": 1,
  "purchase_unit_cost": 800,
  "qty": 100,
  "stock_date": "2026-07-19"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product stock created successfully.",
  "data": {
    "id": 10,
    "tenant_id": 1,
    "product_id": 1,
    "purchase_unit_cost": "800.00",
    "qty": 100,
    "remaining_qty": 100,
    "stock_date": "2026-07-19",
    "stock_alert": false,
    "is_used": false,
    "product": {
      "id": 1,
      "category_id": 1,
      "category_name": "Apparel",
      "product_code": "PRD-0001",
      "product_name": "Premium T-Shirt",
      "product_image": "https://example.com/storage/products/image.webp",
      "unit": "pcs",
      "color": "Blue",
      "size": "XL",
      "weight": "250g",
      "price": "1250.00"
    }
  },
  "errors": "No Errors"
}
```

Required: `product_id`, `purchase_unit_cost`, `qty`, `stock_date`. `qty` is an integer with minimum `0`. Product must belong to the tenant. Do not send `remaining_qty`; the backend always sets `remaining_qty = qty`. Later completed sales decrease `remaining_qty`, and return restocks increase it. Nested `product` includes `category_id` and `category_name`. `is_used` is `false` for newly created batches.

API Name: List Product Stock History
API End Point: `GET /api/product-stock-history?product_id=1&period=last_100_records`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product stock history retrieved successfully.",
  "data": [
    {
      "id": 10,
      "tenant_id": 1,
      "product_id": 1,
      "purchase_unit_cost": "800.00",
      "qty": 100,
      "remaining_qty": 80,
      "stock_date": "2026-07-19",
      "stock_alert": false,
      "is_used": true,
      "product": {
        "id": 1,
        "category_id": 1,
        "category_name": "Apparel",
        "product_code": "PRD-0001",
        "product_name": "Premium T-Shirt",
        "product_image": "https://example.com/storage/products/image.webp",
        "unit": "pcs",
        "color": "Blue",
        "size": "XL",
        "weight": "250g",
        "price": "1250.00"
      }
    }
  ],
  "errors": "No Errors"
}
```

`product_id` is required and must belong to the tenant. Filtering uses `stock_date` with `X-Timezone`. Nested `product` includes `category_id` and `category_name`. `is_used` is `true` when the batch has already been allocated to a sale (has stock layers); unused batches are `false` and can still be updated or deleted.

- `last_100_records` (default): latest 100 stock records, without a date window
- `last_30_days`: today and the previous 29 calendar days
- `last_60_days`: today and the previous 59 calendar days
- `last_90_days`: today and the previous 89 calendar days
- `custom`: inclusive `from_date` through `to_date`, maximum 120 days

Batches are ordered by lowest `remaining_qty` first. `stock_alert` is `true` when that batch's `remaining_qty` is less than or equal to the tenant shop setting `low_stock_threshold` (defaults to `0` when settings are missing). `is_used` is independent of `remaining_qty` / restocks — it stays `true` once a sale has consumed the batch.

API Name: Update Product Stock Batch
API End Point: `PUT /api/product-stocks/{product_stock_id}`
Request Payload JSON:

```JSON
{
  "purchase_unit_cost": 850,
  "qty": 120,
  "stock_date": "2026-07-20"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product stock updated successfully.",
  "data": {
    "id": 10,
    "tenant_id": 1,
    "product_id": 1,
    "purchase_unit_cost": "850.00",
    "qty": 120,
    "remaining_qty": 120,
    "stock_date": "2026-07-20",
    "stock_alert": false,
    "is_used": false,
    "product": {
      "id": 1,
      "category_id": 1,
      "category_name": "Apparel",
      "product_code": "PRD-0001",
      "product_name": "Premium T-Shirt",
      "product_image": "https://example.com/storage/products/image.webp",
      "unit": "pcs",
      "color": "Blue",
      "size": "XL",
      "weight": "250g",
      "price": "1250.00"
    }
  },
  "errors": "No Errors"
}
```

Update is allowed only while this stock batch has never been used in a sale. Do not send `remaining_qty`; when `qty` is updated, the backend sets `remaining_qty = qty`. Nested `product` includes `category_id` and `category_name`. `is_used` is always `false` on successful update responses (used batches cannot be updated).

API Name: Delete Product Stock Batch
API End Point: `DELETE /api/product-stocks/{product_stock_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Product stock deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

Delete is allowed only while this stock batch has never been used in a sale.

---



## Customers

`customer_phone` is exact-string unique per tenant. No phone normalization is performed (`01712345678` and `+8801712345678` are different values). Totals are managed by the backend. `created_by` / `updated_by` return related user names (or `null`).

API Name: List Customers
API End Point: `GET /api/customers?period=last_100_records`

Search example: `GET /api/customers?search=017`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customers retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678",
      "total_sale": "1000.00",
      "total_paid": "250.00",
      "total_due": "750.00",
      "created_by": "Stockbin Admin",
      "updated_by": "Shop Salesman"
    }
  ],
  "errors": "No Errors"
}
```

Optional query: `period` / `from_date` / `to_date`, `search` (name or phone).

- `search`: case-insensitive match against `customer_name` and `customer_phone`; when provided it overrides and ignores all other filters (`period`, `from_date`, `to_date`) and returns up to 100 matching tenant customers ordered by newest first; empty/omitted keeps the normal filtered list behavior below
- `last_100_records` (default): latest 100 customers, without a date window
- `last_30_days`: today and the previous 29 calendar days
- `last_60_days`: today and the previous 59 calendar days
- `last_90_days`: today and the previous 89 calendar days
- `custom`: inclusive `from_date` through `to_date`, maximum 120 days

No pagination. Results are always ordered by newest `created_at` first. `created_at` filtering uses local-day boundaries from `X-Timezone`, converted to UTC. `created_by` and `updated_by` return the related user names (or `null`).

API Name: List Due Customers
API End Point: `GET /api/customers/due`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Due customers retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678",
      "total_sale": "1000.00",
      "total_paid": "250.00",
      "total_due": "750.00",
      "created_by": "Stockbin Admin",
      "updated_by": "Shop Salesman"
    }
  ],
  "errors": "No Errors"
}
```

Returns all tenant customers with `total_due > 0`, without pagination, ordered by highest due.

API Name: Create Customer
API End Point: `POST /api/customers`
Request Payload JSON:

```JSON
{
  "customer_name": "Karim Ali",
  "customer_phone": "01712345678"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "customer_name": "Karim Ali",
    "customer_phone": "01712345678",
    "total_sale": "0.00",
    "total_paid": "0.00",
    "total_due": "0.00",
    "created_by": "Stockbin Admin",
    "updated_by": null
  },
  "errors": "No Errors"
}
```

API Name: Update Customer
API End Point: `PUT /api/customers/{customer_id}`
Request Payload JSON:

```JSON
{
  "customer_name": "Karim Updated",
  "customer_phone": "01799999999"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "customer_name": "Karim Updated",
    "customer_phone": "01799999999",
    "total_sale": "1000.00",
    "total_paid": "250.00",
    "total_due": "750.00",
    "created_by": "Stockbin Admin",
    "updated_by": "Shop Salesman"
  },
  "errors": "No Errors"
}
```

The current customer's existing phone remains valid; another customer in the same tenant cannot already use the new phone.

API Name: Delete Customer
API End Point: `DELETE /api/customers/{customer_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

A customer cannot be deleted when payment records exist, or when sale invoices exist.

API Name: List Customer Payments
API End Point: `GET /api/customers/{customer_id}/payments?period=last_100_records`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer payments retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "customer_id": 1,
      "sale_invoice_id": 1,
      "amount": "250.50",
      "payment_method": "cash",
      "payment_date": "2026-07-19",
      "note": "Partial payment",
      "created_by": "Stockbin Admin",
      "updated_by": null,
      "customer": {
        "id": 1,
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678"
      },
      "sale_invoice": {
        "id": 1,
        "invoice_no": "INV-20260719-0001",
        "invoice_status": "completed",
        "grand_total": "1186.50",
        "paid_amount": "250.50",
        "due_amount": "936.00",
        "payment_status": "partial"
      }
    }
  ],
  "errors": "No Errors"
}
```

Optional query: `period`, `from_date`, `to_date`. Filtering uses `payment_date`, with “today” from `X-Timezone`. No search.

- `last_100_records` (default): latest 100 payments for the customer, without a date window
- `last_30_days`: today and the previous 29 calendar days
- `last_60_days`: today and the previous 59 calendar days
- `last_90_days`: today and the previous 89 calendar days
- `custom`: inclusive `from_date` through `to_date`, maximum 120 days

Results are ordered by newest `payment_date` first. `created_by` and `updated_by` return the related user names (or `null`).

---



## Customer Payments

Every payment must be linked to a sale invoice. Required on create: `customer_id` and `sale_invoice_id`. The customer and invoice must belong to the authenticated tenant. The invoice must belong to that same customer, and its `invoice_status` must be `completed` or `returned`. Creating a payment requires the invoice to have remaining due (`grand_total - return_amount - net paid > 0`, where net paid = payments minus return cash refunds), and `amount` must not exceed that invoice due. Create/update/delete recalculates invoice `paid_amount` / `due_amount` / `payment_status` and customer `total_paid` / `total_due` transactionally (`paid_amount` and `total_paid` = net payments minus return cash refunds; `total_due` = sum of invoice `due_amount` for `completed` / `returned` invoices); customer `total_sale` is not changed by payment APIs. `customer_id` and `sale_invoice_id` are immutable on update. `created_by`, `updated_by`, and `tenant_id` come from the backend.

API Name: Create Customer Payment
API End Point: `POST /api/customer-payments`
Request Payload JSON:

```JSON
{
  "customer_id": 1,
  "sale_invoice_id": 1,
  "amount": 250.5,
  "payment_method": "cash",
  "payment_date": "2026-07-19",
  "note": "Partial payment"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer payment created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "customer_id": 1,
    "sale_invoice_id": 1,
    "amount": "250.50",
    "payment_method": "cash",
    "payment_date": "2026-07-19",
    "note": "Partial payment",
    "created_by": "Stockbin Admin",
    "updated_by": null,
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "sale_invoice": {
      "id": 1,
      "invoice_no": "INV-20260719-0001",
      "invoice_status": "completed",
      "grand_total": "1186.50",
      "paid_amount": "250.50",
      "due_amount": "936.00",
      "payment_status": "partial"
    }
  },
  "errors": "No Errors"
}
```

API Name: Update Customer Payment
API End Point: `PUT /api/customer-payments/{customer_payment_id}`
Request Payload JSON:

```JSON
{
  "amount": 300,
  "payment_method": "bkash",
  "payment_date": "2026-07-20",
  "note": "Updated payment"
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer payment updated successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "customer_id": 1,
    "sale_invoice_id": 1,
    "amount": "300.00",
    "payment_method": "bkash",
    "payment_date": "2026-07-20",
    "note": "Updated payment",
    "created_by": "Stockbin Admin",
    "updated_by": "Shop Salesman",
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "sale_invoice": {
      "id": 1,
      "invoice_no": "INV-20260719-0001",
      "invoice_status": "completed",
      "grand_total": "1186.50",
      "paid_amount": "300.00",
      "due_amount": "886.50",
      "payment_status": "partial"
    }
  },
  "errors": "No Errors"
}
```

Invoice assignment (`sale_invoice_id` / `customer_id`) cannot be changed on update. Maximum updated amount is the invoice’s remaining due plus the old payment amount.

API Name: Delete Customer Payment
API End Point: `DELETE /api/customer-payments/{customer_payment_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Customer payment deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

---



## Sale Invoices

Mobile uses a **single** invoice list + details API (drafts stay on dedicated draft endpoints for POS).

| Action | Endpoint |
| --- | ---- |
| List (non-draft) | `GET /api/sale-invoices?period=last_100_records&filter=&search=&from_date=&to_date=` |
| Details | `GET /api/sale-invoices/{sale_invoice_id}` |
| PDF download | `GET /api/sale-invoices/{sale_invoice_id}/pdf` |
| PDF stream | `GET /api/sale-invoices/{sale_invoice_id}/pdf/stream` |
| Draft list | `GET /api/sale-invoices/draft` |
| Draft show / update / complete / delete | `/api/sale-invoices/draft/{id}` … |

### List filters (`filter`)

| `filter` | Scope |
| --- | ---- |
| _(omit / empty)_ | All non-draft invoices |
| `due` | `due_amount > 0` |
| `paid` | `payment_status = paid` |
| `return` | Any line with `restocked_qty > 0` |
| `wastage` | Any line with `wastage_qty > 0` |

List returns invoice headers with nested customer only (no line items). Each row includes badge fields:

- `total_restocked_qty` — sum of line restocked qty (show as `{n} Return`)
- `total_wastage_qty` — sum of line wastage qty (show as `{n} Wastage`)
- `due_amount` / `payment_status` — Due / Paid badges

Filtering uses `invoice_date` for period windows, with “today” from `X-Timezone`. List rows are ordered by newest `created_at` first. `created_by` / `updated_by` return related user names (or `null`). Details return the full invoice (items, product, FIFO `stock_layers`). Draft show (`GET /api/sale-invoices/draft/{id}`) only returns invoices with `invoice_status = draft`.

### List

API Name: List Sale Invoices
API End Point: `GET /api/sale-invoices?period=last_100_records&filter=&search=&from_date=&to_date=`

Search example: `GET /api/sale-invoices?search=INV-20260719`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale invoices retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "invoice_no": "INV-20260719-0001",
      "customer_id": 1,
      "invoice_date": "2026-07-19",
      "sub_total": "1180.00",
      "invoice_discount_amount": "50.00",
      "vat_rate": "5.00",
      "vat_amount": "56.50",
      "grand_total": "1186.50",
      "paid_amount": "250.50",
      "due_amount": "936.00",
      "return_amount": "0.00",
      "payment_status": "partial",
      "invoice_status": "completed",
      "total_restocked_qty": 0,
      "total_wastage_qty": 0,
      "created_by": "Stockbin Admin",
      "updated_by": null,
      "customer": {
        "id": 1,
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678"
      }
    }
  ],
  "errors": "No Errors"
}
```

Optional query: `period` / `from_date` / `to_date`, `search` (invoice no, customer name, or phone), `filter` (`due`|`paid`|`return`|`wastage`). No `sort`/`order` — results are always ordered by newest `created_at` first.

- `search`: case-insensitive match against `invoice_no`, related `customer_name`, and `customer_phone`; when provided it ignores day/date filters (`period`, `from_date`, `to_date`) and returns up to 100 matching non-draft invoices ordered by newest `invoice_date` first; empty/omitted keeps the normal filtered list behavior below
- `last_100_records` (default): latest 100 non-draft invoices by `invoice_date`, without a date window
- `last_30_days`: today and the previous 29 calendar days
- `last_60_days`: today and the previous 59 calendar days
- `last_90_days`: today and the previous 89 calendar days
- `custom`: inclusive `from_date` through `to_date`, maximum 120 days

No pagination. List responses omit `items`.

### Details

API Name: Show Sale Invoice
API End Point: `GET /api/sale-invoices/{sale_invoice_id}`

Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale invoice retrieved successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "invoice_no": "INV-20260719-0001",
    "customer_id": 1,
    "invoice_date": "2026-07-19",
    "sub_total": "1180.00",
    "invoice_discount_amount": "50.00",
    "vat_rate": "5.00",
    "vat_amount": "56.50",
    "grand_total": "1186.50",
    "paid_amount": "250.50",
    "due_amount": "936.00",
    "return_amount": "0.00",
    "payment_status": "partial",
    "invoice_status": "completed",
    "total_restocked_qty": 0,
    "total_wastage_qty": 0,
    "created_by": "Stockbin Admin",
    "updated_by": null,
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "sold_qty": 2,
        "sale_unit_price": "600.00",
        "sale_discount_amount": "20.00",
        "sale_line_total": "1180.00",
        "purchase_cost_total": "1600.00",
        "returned_qty": 0,
        "restocked_qty": 0,
        "wastage_qty": 0,
        "product": {
          "id": 1,
          "product_code": "PRD-0001",
          "product_name": "Premium T-Shirt",
          "category_name": "Apparel",
          "product_image": "https://example.com/storage/products/image.webp",
          "unit": "pcs",
          "color": "Blue",
          "size": "XL",
          "weight": "250g"
        },
        "stock_layers": [
          {
            "id": 1,
            "product_stock_id": 10,
            "purchase_unit_cost": "800.00",
            "sold_qty": 2,
            "returned_qty": 0,
            "restocked_qty": 0,
            "wastage_qty": 0
          }
        ]
      }
    ]
  },
  "errors": "No Errors"
}
```

Same response shape as create. Nested `product` includes `category_name`, `product_image`, `unit`, `color`, `size`, and `weight`.

### Invoice PDF

PDF mirrors **invoice details** (same tenant-scoped show data): header, customer, line items, payment totals, and return/wastage qty. Works for `draft`, `completed`, and `returned`. Template follows shop setting `invoice_type`:

| `invoice_type` | Template | Paper |
| --- | --- | --- |
| `standard` (default) | A4 layout | A4 portrait |
| `thermal` | Receipt layout | ~80mm thermal |

Response is **binary PDF** (`Content-Type: application/pdf`), not the JSON envelope. Send `Authorization: Bearer {{token}}`. Filename: `Invoice-{invoice_no}.pdf`.

API Name: Download Sale Invoice PDF
API End Point: `GET /api/sale-invoices/{sale_invoice_id}/pdf`

Request Payload JSON:

```JSON
{}
```

Response: PDF file download.

API Name: Stream Sale Invoice PDF
API End Point: `GET /api/sale-invoices/{sale_invoice_id}/pdf/stream`

Request Payload JSON:

```JSON
{}
```

Response: PDF inline stream (browser preview). Cross-tenant ids return the standard JSON error envelope (`Resource not found.`).

PDF contents (details-aligned):

- Invoice meta: `invoice_no`, `invoice_date`, `invoice_status`, `payment_status`
- Badges when > 0: `total_restocked_qty`, `total_wastage_qty`
- Lines: product, `sold_qty`, `sale_unit_price`, `sale_line_total`, plus `returned_qty` / `restocked_qty` / `wastage_qty`
- Summary: subtotal, discount, VAT, grand total, paid, due, `return_amount` (when > 0)

### Draft list

API Name: List Draft Sale Invoices
API End Point: `GET /api/sale-invoices/draft?period=last_100_records&search=&from_date=&to_date=`

Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Draft sale invoices retrieved successfully.",
  "data": [
    {
      "id": 2,
      "tenant_id": 1,
      "invoice_no": "INV-20260721-0002",
      "customer_id": 1,
      "invoice_date": "2026-07-21",
      "sub_total": "200.00",
      "invoice_discount_amount": "0.00",
      "vat_rate": "15.00",
      "vat_amount": "30.00",
      "grand_total": "230.00",
      "paid_amount": "0.00",
      "due_amount": "230.00",
      "return_amount": "0.00",
      "payment_status": "unpaid",
      "invoice_status": "draft",
      "total_restocked_qty": 0,
      "total_wastage_qty": 0,
      "created_by": "Stockbin Admin",
      "updated_by": null,
      "customer": {
        "id": 1,
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678"
      }
    }
  ],
  "errors": "No Errors"
}
```

Same period/search/`X-Timezone` contract as `GET /api/sale-invoices`, but scoped to `invoice_status = draft` only. `filter` is ignored for the draft tab. List responses omit `items`.

### Draft details

API Name: Show Draft Sale Invoice
API End Point: `GET /api/sale-invoices/draft/{sale_invoice_id}`

Request Payload JSON:

```JSON
{}
```

Response Payload JSON: same shape as show/create for a draft invoice (includes `items`; `stock_layers` empty until complete). Non-draft or cross-tenant ids fail.

### Draft lifecycle

Only invoices with `invoice_status = draft` (same tenant) are accepted for draft update/complete/delete. Completed/returned invoices fail.

API Name: Update Draft Sale Invoice
API End Point: `PUT /api/sale-invoices/draft/{sale_invoice_id}`
Request Payload JSON:

```JSON
{
  "customer_id": 1,
  "invoice_date": "2026-07-21",
  "invoice_discount_amount": 10,
  "vat_rate": 15,
  "items": [
    {
      "product_id": 2,
      "sold_qty": 2,
      "sale_unit_price": 100,
      "sale_discount_amount": 0
    }
  ]
}
```

Response Payload JSON: same shape as create/show (draft; empty `stock_layers`). Replaces all line items. No FIFO, no customer ledger change. `invoice_no` is kept.

API Name: Complete Draft Sale Invoice
API End Point: `POST /api/sale-invoices/draft/{sale_invoice_id}/complete`
Request Payload JSON:

```JSON
{
  "paid_amount": 500,
  "payment_method": "cash"
}
```

Response Payload JSON: same shape as create completed invoice. Uses the draft’s current customer/items/totals. Allocates FIFO stock, updates customer ledger, and creates a linked payment when `paid_amount > 0` (`payment_method` required then). `paid_amount` defaults to `0`.

API Name: Delete Draft Sale Invoice
API End Point: `DELETE /api/sale-invoices/draft/{sale_invoice_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Draft sale invoice deleted successfully.",
  "data": null,
  "errors": "No Errors"
}
```

Deletes the draft and its items. No stock/ledger side effects.

Create a draft or completed sale invoice. `invoice_no` is generated by the backend (`INV-YYYYMMDD-####`). Totals are computed server-side:

- Line total = `(sold_qty × sale_unit_price) − sale_discount_amount`
- `sub_total` = sum of line totals
- Taxable = `sub_total − invoice_discount_amount`
- `vat_amount` = round half-up of `taxable × (vat_rate / 100)`
- `grand_total` = taxable + `vat_amount`
- `paid_amount` must not exceed `grand_total`
- `invoice_discount_amount` must not exceed `sub_total`
- Line `sale_discount_amount` must not exceed that line’s gross amount

`customer_id` is required and must belong to the tenant.

### Draft (`invoice_status: "draft"`)

- Products must belong to the tenant (inactive products allowed)
- No FIFO stock allocation; `stock_layers` are empty and `purchase_cost_total` is `0.00`
- `paid_amount` must be `0` (no payment on draft)
- Customer ledger (`total_sale` / `total_due`) is not updated

### Completed (`invoice_status: "completed"`)

- Products must belong to the tenant and be active
- FIFO stock is allocated from earliest `stock_date` (then `id`); insufficient stock fails validation
- Each allocation is stored as a stock layer with `product_stock_id`, `purchase_unit_cost`, and `sold_qty`
- With `paid_amount > 0`: backend creates a mandatory linked customer payment for that invoice (`payment_method` required); invoice and customer balances sync through that payment
- With `paid_amount = 0`: invoice starts unpaid; customer `total_sale` increases by `grand_total` and `total_due` is recalculated; no payment record

`created_by`, `updated_by`, `tenant_id`, and computed monetary fields come from the backend.

API Name: Create Sale Invoice
API End Point: `POST /api/sale-invoices`
Request Payload JSON:

```JSON
{
  "customer_id": 1,
  "invoice_date": "2026-07-19",
  "invoice_discount_amount": 50,
  "vat_rate": 5,
  "paid_amount": 250.5,
  "payment_method": "cash",
  "invoice_status": "completed",
  "items": [
    {
      "product_id": 1,
      "sold_qty": 2,
      "sale_unit_price": 600,
      "sale_discount_amount": 20
    }
  ]
}
```

`invoice_discount_amount`, `paid_amount`, and each item `sale_discount_amount` default to `0` when omitted. `payment_method` is required when the invoice is completed and `paid_amount > 0`.

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale invoice created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "invoice_no": "INV-20260719-0001",
    "customer_id": 1,
    "invoice_date": "2026-07-19",
    "sub_total": "1180.00",
    "invoice_discount_amount": "50.00",
    "vat_rate": "5.00",
    "vat_amount": "56.50",
    "grand_total": "1186.50",
    "paid_amount": "250.50",
    "due_amount": "936.00",
    "return_amount": "0.00",
    "payment_status": "partial",
    "invoice_status": "completed",
    "total_restocked_qty": 0,
    "total_wastage_qty": 0,
    "created_by": "Stockbin Admin",
    "updated_by": null,
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "sold_qty": 2,
        "sale_unit_price": "600.00",
        "sale_discount_amount": "20.00",
        "sale_line_total": "1180.00",
        "purchase_cost_total": "1600.00",
        "returned_qty": 0,
        "restocked_qty": 0,
        "wastage_qty": 0,
        "product": {
          "id": 1,
          "product_code": "PRD-0001",
          "product_name": "Premium T-Shirt",
          "category_name": "Apparel",
          "product_image": "https://example.com/storage/products/image.webp",
          "unit": "pcs",
          "color": "Blue",
          "size": "XL",
          "weight": "250g"
        },
        "stock_layers": [
          {
            "id": 1,
            "product_stock_id": 10,
            "purchase_unit_cost": "800.00",
            "sold_qty": 2,
            "returned_qty": 0,
            "restocked_qty": 0,
            "wastage_qty": 0
          }
        ]
      }
    ]
  },
  "errors": "No Errors"
}
```

Nested item `product` includes `category_name`, `product_image`, `unit`, `color`, `size`, and `weight` (same shape on create, show, update-draft, and complete-draft responses).

---



## Sale Returns

List + show **restock-only** returns (`total_restocked_qty > 0` and `total_wastage_qty = 0`). Pure wastage returns appear on Sale Wastages. When a single create request mixes restock and wastage (per line or across lines), the backend splits it into separate restock and wastage records so each appears on the correct list. Filtering uses `return_date`, with “today” from `X-Timezone`. `created_by` / `updated_by` return related user names (or `null`).

API Name: List Sale Returns
API End Point: `GET /api/sale-returns?period=last_100_records&search=&from_date=&to_date=`

Search example: `GET /api/sale-returns?search=RET-20260720`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale returns retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "invoice_id": 1,
      "return_no": "RET-20260720-0001",
      "return_date": "2026-07-20",
      "total_returned_qty": 1,
      "total_restocked_qty": 1,
      "total_wastage_qty": 0,
      "refund_amount": "0.00",
      "reason": "Damaged item",
      "note": "Customer returned one unit",
      "created_by": "Stockbin Admin",
      "updated_by": null,
      "invoice": {
        "id": 1,
        "invoice_no": "INV-20260719-0001",
        "invoice_status": "returned",
        "due_amount": "342.75",
        "return_amount": "593.25",
        "payment_status": "partial"
      },
      "customer": {
        "id": 1,
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678"
      }
    }
  ],
  "errors": "No Errors"
}
```

Optional query: `period` / `from_date` / `to_date`, `search` (return no, invoice no, customer name, or phone). No `sort`/`order` — results are always ordered by newest `created_at` first.

- `search`: case-insensitive match against `return_no`, related `invoice_no`, `customer_name`, and `customer_phone`; when provided it ignores day/date filters (`period`, `from_date`, `to_date`) and returns up to 100 matching returns ordered by newest `return_date` first; empty/omitted keeps the normal filtered list behavior below
- `last_100_records` (default): latest 100 returns by `return_date`, without a date window
- `last_30_days`: today and the previous 29 calendar days
- `last_60_days`: today and the previous 59 calendar days
- `last_90_days`: today and the previous 89 calendar days
- `custom`: inclusive `from_date` through `to_date`, maximum 120 days

No pagination. List always scopes to restock-only returns (`total_restocked_qty > 0` and `total_wastage_qty = 0`), including search. List responses omit `items` (and omit computed `return_value` / `due_adjustment`, which appear only on create).

API Name: Show Sale Return
API End Point: `GET /api/sale-returns/{sale_return_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale return retrieved successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "invoice_id": 1,
    "return_no": "RET-20260720-0001",
    "return_date": "2026-07-20",
    "total_returned_qty": 1,
    "total_restocked_qty": 1,
    "total_wastage_qty": 0,
    "refund_amount": "0.00",
    "reason": "Damaged item",
    "note": "Customer returned one unit",
    "created_by": "Stockbin Admin",
    "updated_by": null,
    "invoice": {
      "id": 1,
      "invoice_no": "INV-20260719-0001",
      "invoice_status": "returned",
      "due_amount": "342.75",
      "return_amount": "593.25",
      "payment_status": "partial"
    },
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "items": [
      {
        "id": 1,
        "sale_invoice_item_id": 1,
        "sale_invoice_item_stock_layer_id": 1,
        "product_id": 1,
        "returned_qty": 1,
        "restocked_qty": 1,
        "wastage_qty": 0,
        "refund_amount": "593.25",
        "reason": "Size mismatch",
        "product": {
          "id": 1,
          "product_code": "PRD-0004",
          "product_name": "Cotton Polo Shirt",
          "category_name": "Fashion",
          "product_image": "https://example.com/storage/products/polo.webp",
          "unit": "pcs",
          "color": "Navy",
          "size": "L",
          "weight": "250g"
        }
      }
    ]
  },
  "errors": "No Errors"
}
```

Same restock-only scope as the list. Wastage-only, missing, or cross-tenant ids fail. Includes `items` with nested `product` (`product_code`, `product_name`, `category_name`, `product_image`, `unit`, `color`, `size`, `weight`); omits create-only `return_value` / `due_adjustment` / `companion_returns` / `total_refund_amount`.

Create a return (restock and/or wastage) against a completed or already-returned sale invoice. Only invoices belonging to the authenticated tenant are accepted. Each return item must reference a distinct `sale_invoice_item_id` on that invoice. `returned_qty` must equal `restocked_qty + wastage_qty`, must be at least `1`, and must not exceed the item’s remaining returnable quantity (`sold_qty − returned_qty`).

Disposition after create:

- Pure restock (`total_restocked_qty > 0`, `total_wastage_qty = 0`) → one record on `GET /api/sale-returns`
- Pure wastage (`total_wastage_qty > 0`, `total_restocked_qty = 0`) → one record on `GET /api/sale-wastages`
- Mixed restock+wastage in one request → backend splits into separate restock and wastage `SaleReturn` records (per-line mixed qty becomes two virtual lines). The create response is the restock record when any restock qty exists, otherwise the wastage record. `companion_returns` lists the other record(s) from the same request; `return_value`, `due_adjustment`, and `total_refund_amount` are combined totals for the whole request. Each split record gets its share of `return_value`, `due_adjustment`, and `refund_amount` by the same proportional rules (per-unit return value is identical for restock vs wastage qty from the same line).

Return value is computed proportionally by the backend (not client-supplied):

- Item share of invoice = `sale_line_total / invoice.sub_total`
- Quantity ratio = `returned_qty / sold_qty`
- Item return value = round/allocate so shares of `grand_total × share × qty_ratio` sum exactly
- Header `return_value` is the sum of item return values (combined across split records on create)

Settlement:

- Due-first on the combined request — `due_adjustment = min(invoice.due_amount, return_value)`, cash refund = remainder; then each split restock/wastage record receives a proportional share of `return_value`, `due_adjustment`, and `refund_amount`. Customer `total_sale` decreases by combined `return_value`; invoice `paid_amount` and customer `total_paid` are net of cash refunds (`sum(payments) − sum(return refund_amount)`); `total_due` is the sum of `due_amount` across the customer’s `completed` / `returned` invoices (same source as invoice-level due)

Stock:

- Restocked quantities are returned to the original FIFO stock layers (`remaining_qty` increases)
- Wastage quantities do not restock
- Layer allocation follows original FIFO order (earliest stock date first)

The invoice’s `return_amount` increases by `return_value`, `due_amount` decreases by `due_adjustment`, `payment_status` is recalculated, and `invoice_status` becomes `returned` only when every line is fully returned; otherwise it stays `completed`. `return_no` is generated by the backend (`RET-YYYYMMDD-####`) for each split record.

API Name: Create Sale Return
API End Point: `POST /api/sale-invoices/{sale_invoice_id}/returns`
Request Payload JSON:

```JSON
{
  "return_date": "2026-07-20",
  "reason": "Damaged item",
  "note": "Customer returned one unit",
  "items": [
    {
      "sale_invoice_item_id": 1,
      "returned_qty": 1,
      "restocked_qty": 1,
      "wastage_qty": 0,
      "reason": "Size mismatch"
    }
  ]
}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale return created successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "invoice_id": 1,
    "return_no": "RET-20260720-0001",
    "return_date": "2026-07-20",
    "total_returned_qty": 1,
    "total_restocked_qty": 1,
    "total_wastage_qty": 0,
    "return_value": "593.25",
    "due_adjustment": "593.25",
    "refund_amount": "0.00",
    "total_refund_amount": "0.00",
    "reason": "Damaged item",
    "note": "Customer returned one unit",
    "created_by": "Stockbin Admin",
    "updated_by": null,
    "invoice": {
      "id": 1,
      "invoice_no": "INV-20260719-0001",
      "invoice_status": "returned",
      "due_amount": "342.75",
      "return_amount": "593.25",
      "payment_status": "partial"
    },
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "items": [
      {
        "id": 1,
        "sale_invoice_item_id": 1,
        "sale_invoice_item_stock_layer_id": 1,
        "product_id": 1,
        "returned_qty": 1,
        "restocked_qty": 1,
        "wastage_qty": 0,
        "refund_amount": "593.25",
        "reason": "Size mismatch",
        "product": {
          "id": 1,
          "product_code": "PRD-0004",
          "product_name": "Cotton Polo Shirt",
          "category_name": "Fashion",
          "product_image": "https://example.com/storage/products/polo.webp",
          "unit": "pcs",
          "color": "Navy",
          "size": "L",
          "weight": "250g"
        }
      }
    ]
  },
  "errors": "No Errors"
}
```

## Sale Wastages

List wastage headers (no line items) for **wastage-only** returns (`total_wastage_qty > 0` and `total_restocked_qty = 0`). Pure restock returns appear on Sale Returns. Mixed create requests are split by the backend (see Create Sale Return). Same period/search contract as sale returns (no `sort`/`order` — always newest `created_at` first), filtered by `return_date` with “today” from `X-Timezone`. `created_by` / `updated_by` return related user names (or `null`). Create wastage via `POST /api/sale-invoices/{sale_invoice_id}/returns` with `restocked_qty = 0` and `wastage_qty > 0` (see Create Sale Return).

API Name: List Sale Wastages
API End Point: `GET /api/sale-wastages?period=last_100_records&search=&from_date=&to_date=`

Search example: `GET /api/sale-wastages?search=RET-20260720`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale wastages retrieved successfully.",
  "data": [
    {
      "id": 1,
      "tenant_id": 1,
      "invoice_id": 1,
      "return_no": "RET-20260720-0002",
      "return_date": "2026-07-20",
      "total_returned_qty": 1,
      "total_restocked_qty": 0,
      "total_wastage_qty": 1,
      "refund_amount": "0.00",
      "reason": "Damaged beyond repair",
      "note": "Disposed as wastage",
      "created_by": "Stockbin Admin",
      "updated_by": null,
      "invoice": {
        "id": 1,
        "invoice_no": "INV-20260719-0001",
        "invoice_status": "returned",
        "due_amount": "342.75",
        "return_amount": "593.25",
        "payment_status": "partial"
      },
      "customer": {
        "id": 1,
        "customer_name": "Karim Ali",
        "customer_phone": "01712345678"
      }
    }
  ],
  "errors": "No Errors"
}
```

Optional query: `period` / `from_date` / `to_date`, `search` (return no, invoice no, customer name, or phone). No `sort`/`order` — results are always ordered by newest `created_at` first. Same period and search rules as sale returns. List always scopes to wastage-only (`total_wastage_qty > 0` and `total_restocked_qty = 0`). List responses omit `items` and create-only `return_value` / `due_adjustment`.

API Name: Show Sale Wastage
API End Point: `GET /api/sale-wastages/{sale_wastage_id}`
Request Payload JSON:

```JSON
{}
```

Response Payload JSON:

```JSON
{
  "success": true,
  "message": "Sale wastage retrieved successfully.",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "invoice_id": 1,
    "return_no": "RET-20260720-0002",
    "return_date": "2026-07-20",
    "total_returned_qty": 1,
    "total_restocked_qty": 0,
    "total_wastage_qty": 1,
    "refund_amount": "0.00",
    "reason": "Damaged beyond repair",
    "note": "Disposed as wastage",
    "created_by": "Stockbin Admin",
    "updated_by": null,
    "invoice": {
      "id": 1,
      "invoice_no": "INV-20260719-0001",
      "invoice_status": "returned",
      "due_amount": "342.75",
      "return_amount": "593.25",
      "payment_status": "partial"
    },
    "customer": {
      "id": 1,
      "customer_name": "Karim Ali",
      "customer_phone": "01712345678"
    },
    "items": [
      {
        "id": 1,
        "sale_invoice_item_id": 1,
        "sale_invoice_item_stock_layer_id": 1,
        "product_id": 1,
        "returned_qty": 1,
        "restocked_qty": 0,
        "wastage_qty": 1,
        "refund_amount": "593.25",
        "reason": "Broken",
        "product": {
          "id": 1,
          "product_code": "PRD-0008",
          "product_name": "Mustard Oil 1L",
          "category_name": "Grocery",
          "product_image": "https://example.com/storage/products/oil.webp",
          "unit": "pcs",
          "color": null,
          "size": null,
          "weight": "1kg"
        }
      }
    ]
  },
  "errors": "No Errors"
}
```

Same wastage-only scope as the list. Mixed, restock-only, missing, or cross-tenant ids fail. Includes `items` with nested `product` (`product_code`, `product_name`, `category_name`, `product_image`, `unit`, `color`, `size`, `weight`); omits create-only `return_value` / `due_adjustment`.
