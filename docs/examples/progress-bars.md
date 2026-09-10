# Progress Bars

Use a ` ```progress ` fence block to render progress bars directly in Markdown.

## Syntax

Each line: `Label | value | max`

- The bar fills to `value / max × 100%`
- The diff column shows `value − max` (green if positive, red if negative)

## Product prices vs budget

```progress
Product A   | 80  | 100
Product B   | 45  | 100
Product C   | 130 | 100
```

## Price comparison (actual vs reference)

```progress
Coffee      | 3.50  | 4.00
Tea         | 2.20  | 2.00
Juice       | 5.80  | 5.00
Water       | 1.00  | 1.50
```

## Project progress

```progress
Design      | 100 | 100
Development | 72  | 100
Testing     | 30  | 100
Deployment  | 0   | 100
```

## How it works

The fence parser reads each line as `Label | value | max` and computes:

| Column  | Description                        |
|---------|------------------------------------|
| Bar     | `value / max × 100%` fill          |
| `value / max` | Raw numbers                  |
| `%`     | Percentage filled                  |
| `±diff` | `value − max` (green / red / grey) |
