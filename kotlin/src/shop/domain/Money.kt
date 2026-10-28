package shop.domain

@JvmInline
value class Money(val cents: Long) {
    init { require(cents >= 0) { "Money can't be negative: $cents" } }

    operator fun plus(other: Money) = Money(cents + other.cents)
    operator fun minus(other: Money) = Money(cents - other.cents)

    override fun toString() = "€${cents / 100}.${(cents % 100).toString().padStart(2, '0')}"
}

@JvmInline
value class TrackingId(val value: String)
