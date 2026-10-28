package shop.notifications

import shop.domain.OrderState
import shop.domain.OrderState.*

// Notifications: subject line of the customer email.
fun OrderState.emailSubject(): String = when (this) {
    Placed -> "We got your order"
    is Paid -> "Payment of $amount received"
    is Shipped -> "On its way! Tracking: ${tracking.value}"
    Delivered -> "Delivered! 🎉"
    is Refunded -> "Refund of $amount issued"
}
