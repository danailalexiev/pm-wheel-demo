package shop.domain

sealed interface OrderState {
    data object Placed : OrderState
    data class Paid(val amount: Money) : OrderState
    data class Shipped(val tracking: TrackingId) : OrderState
    data object Delivered : OrderState
    data class Refunded(val amount: Money) : OrderState

    // ← PM CHANGE: uncomment this one line on stage, then build.
    // data class PartiallyRefunded(val refunded: Money, val remaining: Money) : OrderState
}
