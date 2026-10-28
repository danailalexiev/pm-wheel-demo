package shop.ids

import shop.domain.Money

// BEFORE: stringly-typed. The swapped call in Main compiles and ships.
object RefundsBefore {
    fun issue(customerId: String, orderId: String, amount: Money) =
        println("  Refunding $amount for order $orderId to customer $customerId")
}

// AFTER: change the signature on stage. The swapped call no longer compiles.
object Refunds {
    fun issue(customerId: CustomerId, orderId: OrderId, amount: Money) =
        println("  Refunding $amount for order ${orderId.value} to customer ${customerId.value}")
}
