import shop.analytics.track
import shop.backend.canRefund
import shop.domain.Money
import shop.domain.OrderState
import shop.domain.TrackingId
import shop.ids.CustomerId
import shop.ids.OrderId
import shop.ids.Refunds
import shop.ids.RefundsBefore
import shop.notifications.emailSubject
import shop.web.badge

fun main() {
    println("ACT 1: order lifecycle")
    val states = listOf(
        OrderState.Placed,
        OrderState.Paid(Money(4_999)),
        OrderState.Shipped(TrackingId("DHL-123")),
        OrderState.Delivered,
        OrderState.Refunded(Money(4_999)),
        // ← PM CHANGE: uncomment together with the new state
        // OrderState.PartiallyRefunded(refunded = Money(1_500), remaining = Money(3_499)),
    )
    for (s in states) {
        println("${s.badge()} | email: \"${s.emailSubject()}\" | canRefund=${s.canRefund()}")
        track(s)
    }

    println("\nACT 2: IDs")
    val orderId = "ord_1001"
    val customerId = "cus_42"
    RefundsBefore.issue(orderId, customerId, Money(1_500)) // swapped! compiles anyway

    val order = OrderId("ord_1001")
    val customer = CustomerId("cus_42")
    Refunds.issue(customer, order, Money(1_500))
    // Refunds.issue(order, customer, Money(1_500))  // ← uncomment: type mismatch, won't compile

    // The Kotlin "escape hatch" is explicit AND still validated:
    runCatching { OrderId(customer.value) }
        .onFailure { println("  Escape hatch blocked at runtime: ${it.message}") }
}
