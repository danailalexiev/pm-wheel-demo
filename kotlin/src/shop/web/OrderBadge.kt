package shop.web

import shop.domain.OrderState
import shop.domain.OrderState.*

data class Badge(val label: String, val color: String)

// Web/mobile UI: the status badge on the order page.
fun OrderState.badge(): Badge = when (this) {
    Placed -> Badge("Placed", "grey")
    is Paid -> Badge("Paid", "blue")
    is Shipped -> Badge("Shipped", "purple")
    Delivered -> Badge("Delivered", "green")
    is Refunded -> Badge("Refunded", "red")
}
