# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep Room entities
-keep class com.onepavala.app.data.entity.** { *; }

# Keep data classes used in flows
-keep class com.onepavala.app.data.dao.** { *; }
