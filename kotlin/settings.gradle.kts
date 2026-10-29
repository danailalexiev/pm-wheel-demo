plugins {
    // Downloads a matching JDK if the toolchain below isn't installed locally.
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "pm-wheel-demo"
