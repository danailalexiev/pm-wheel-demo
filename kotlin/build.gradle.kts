plugins {
    kotlin("jvm") version "2.4.21"
    application
}

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(21)
    // Keep the flat `src/` layout so file paths in the talk stay short.
    sourceSets.main { kotlin.setSrcDirs(listOf("src")) }
}

application {
    mainClass = "MainKt"
}
