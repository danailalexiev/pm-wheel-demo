# pm-wheel-demo

Demo code for the talk **"Forget JS/TS – Kotlin is all you need for fullstack"**.

The same small e-shop domain is written twice, once in TypeScript and once in Kotlin. During the talk a product manager "spins the wheel" and asks for a change. Each act shows what the compiler does for you in each language when that change lands.

## The acts

### Act 1: a new order state (exhaustiveness)

The PM wants a new `PartiallyRefunded` order state. The domain change is one line. The real question is how many consumers notice it.

- **`typescript/act1-naive.ts`**: idiomatic TS that passes `strict: true` and code review. After the change it still compiles, and it's wrong in four places:
  1. a `default` branch added "for safety"
  2. a `Record<string, string>` lookup with a `??` fallback
  3. an allow-list written as a boolean expression
  4. a `void` switch, which TS doesn't check for exhaustiveness
- **`typescript/act1-strict.ts`**: TS that *does* catch the new state. It needs an `assertNever` helper, `default: return assertNever(s)` in every switch, `satisfies Record<OrderKind, …>` on lookup tables, and no boolean shortcuts. It works, but every team has to follow these rules by convention.
- **`kotlin/src/shop/`**: `OrderState` is a `sealed interface`, and every consumer uses `when`. The UI badge (`web/`), refund rules (`backend/`), email subject (`notifications/`) and analytics (`analytics/`) all fail to compile until they handle the new state. That includes `when` *statements*, which must be exhaustive since Kotlin 1.7.

### Act 2: IDs that can't be mixed up

`refund(customerId, orderId, amount)` gets called with the arguments swapped.

- **`typescript/act2-ids.ts`**: with plain strings, the swapped call compiles. Branded types catch the swap, but they leak through `JSON.parse(...) as`, double casts and `any`, and all three skip validation.
- **`kotlin/src/shop/ids/`**: `OrderId` and `CustomerId` are `@JvmInline value class`es, so they cost nothing at runtime. Their `init` validation runs on *every* construction, including the explicit escape hatch `OrderId(customer.value)`.

## Layout

```
typescript/
  domain.ts          shared OrderState union
  act1-naive.ts      Act 1, the TS most teams have
  act1-strict.ts     Act 1, the TS that catches the change (and what it costs)
  act2-ids.ts        Act 2, strings vs branded types
kotlin/
  run.sh             compile + run with plain kotlinc
  src/Main.kt        runs both acts
  src/shop/
    domain/          OrderState (sealed), Money, TrackingId
    web/ backend/ notifications/ analytics/   consumers of OrderState
    ids/             OrderId, CustomerId, Refunds
```

## Running

### TypeScript

Requires Node.js.

```sh
cd typescript
npm install
npm run act1
npm run act2
```

### Kotlin

Requires `kotlinc` on your `PATH` (e.g. `sdk install kotlin`) and a JDK. Tested with Kotlin 2.1.20 / JDK 21.

```sh
cd kotlin
./run.sh
```

## On stage

Look for the `// ← PM CHANGE` and `// ← uncomment` comments.

**Act 1:** uncomment the new state and its sample value, then rebuild both demos:

- `typescript/domain.ts` and `typescript/act1-naive.ts`
- `kotlin/src/shop/domain/OrderState.kt` and `kotlin/src/Main.kt`

TypeScript (naive) builds fine and prints wrong output. Kotlin reports a compile error in every consumer.

**Act 2:** uncomment the swapped `issue(...)` call in `typescript/act2-ids.ts` and the swapped `Refunds.issue(...)` call in `kotlin/src/Main.kt`. Both fail to compile. Then compare what happens at the leaks and the escape hatch.
