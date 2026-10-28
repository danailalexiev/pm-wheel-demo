package shop.analytics

import shop.domain.OrderState
import shop.domain.OrderState.*

// Analytics: a *statement* (no return value). Since Kotlin 1.7 a `when`
// statement over a sealed type must also be exhaustive.
fun track(state: OrderState) {
    when (state) {
        Placed -> log("order_placed")
        is Paid -> log("order_paid", state.amount.cents)
        is Shipped -> log("order_shipped")
        Delivered -> log("order_delivered")
        is Refunded -> log("order_refunded", state.amount.cents)
    }
}

private fun log(event: String, value: Long? = null) =
    println("  [analytics] $event${value?.let { " value=$it" } ?: ""}")
