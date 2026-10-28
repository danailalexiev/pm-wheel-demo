package shop.backend

import shop.domain.OrderState
import shop.domain.OrderState.*

// Backend: which actions are allowed in each state.
fun OrderState.canRefund(): Boolean = when (this) {
    Placed -> false
    is Paid, is Shipped, Delivered -> true
    is Refunded -> false
}
