package shop.ids

// ACT 2. Validation runs on EVERY construction, including explicit conversions.
@JvmInline
value class OrderId(val value: String) {
    init { require(value.startsWith("ord_")) { "Not an order id: $value" } }
}

@JvmInline
value class CustomerId(val value: String) {
    init { require(value.startsWith("cus_")) { "Not a customer id: $value" } }
}
