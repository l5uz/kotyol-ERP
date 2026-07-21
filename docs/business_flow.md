# Enterprise Business Workflows - Kotyol ERP

## Overview
This document maps how the **Warehouse Module** logs movements, triggers low stock alerts, manages unit price revaluations, and reconciles inventory audits.

```
+-----------------------------------------------------------------------------------+
|                            WAREHOUSE MODULE (STOCK ENGINE)                        |
| (Current Stock, Movements Log, Low Stock Warning Cards, Revaluation, Inventory Audit)|
+-----------------------------------------------------------------------------------+
                                         |
         +-------------------------------+-------------------------------+
         |                               |                               |
         v                               v                               v
+------------------+           +------------------+           +------------------+
| Supplier Receipts|           | Production Sarfi |           | Sales Dispatches |
| (Purchasing IN)  |           | (BOM Outflow)    |           | (Commercial OUT) |
+------------------+           +------------------+           +------------------+
```

## Warehouse Audit & Operations Rules

1. **Zero Hardcoded Movement Types & Reasons**:
   - Operations (Purchase, Production Usage, Sale, Manual Adjustment, Defect, Return, Transfer, Inventory Correction, Revaluation) and reasons are dynamically sourced from `dynamicSettingsService`.

2. **Low Stock Threshold Alerting**:
   - Products whose current quantity is less than or equal to `minQuantity` trigger warning cards on the Warehouse Dashboard.

3. **Revaluation & Costing**:
   - Unit price changes update inventory asset valuation ($) with dynamic revaluation reasons.

4. **Inventory Count Reconciliation**:
   - Physical inventory audits calculate the variance (`Actual Quantity` - `System Quantity`) and apply automated adjustments.
