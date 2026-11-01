package com.onepavala.app.ui.component

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.onepavala.app.ui.theme.OnSurfaceVariant
import com.onepavala.app.ui.theme.PrimaryBlue
import com.onepavala.app.ui.theme.SecondaryGreen

data class BarData(
    val label: String,
    val value: Float,
    val isHighlighted: Boolean = false
)

@Composable
fun BarChart(
    bars: List<BarData>,
    modifier: Modifier = Modifier,
    barColor: Color = PrimaryBlue,
    highlightColor: Color = SecondaryGreen
) {
    val maxValue = bars.maxOfOrNull { it.value } ?: 0f
    val labelColor = OnSurfaceVariant.toArgb()

    if (bars.isEmpty() || maxValue == 0f) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .height(200.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No data",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        return
    }

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(200.dp)
    ) {
        val canvasWidth = size.width
        val canvasHeight = size.height
        val topPadding = 30f
        val bottomPadding = 36f
        val chartHeight = canvasHeight - topPadding - bottomPadding
        val barSpacing = 8f
        val totalBars = bars.size
        val barWidth = (canvasWidth - barSpacing * (totalBars + 1)) / totalBars
        val cornerRadius = 8f

        bars.forEachIndexed { index, bar ->
            val left = barSpacing + index * (barWidth + barSpacing)
            val barHeightPx = if (maxValue > 0f) (bar.value / maxValue) * chartHeight else 0f
            val top = topPadding + chartHeight - barHeightPx
            val color = if (bar.isHighlighted) highlightColor else barColor

            // Draw bar
            if (barHeightPx > 0f) {
                drawRoundRect(
                    color = color,
                    topLeft = Offset(left, top),
                    size = Size(barWidth, barHeightPx),
                    cornerRadius = CornerRadius(cornerRadius, cornerRadius)
                )
            } else {
                // Draw a small indicator bar even for zero values
                drawRoundRect(
                    color = color.copy(alpha = 0.2f),
                    topLeft = Offset(left, topPadding + chartHeight - 4f),
                    size = Size(barWidth, 4f),
                    cornerRadius = CornerRadius(2f, 2f)
                )
            }

            // Draw label below the bar
            drawContext.canvas.nativeCanvas.drawText(
                bar.label,
                left + barWidth / 2f,
                canvasHeight - 8f,
                android.graphics.Paint().apply {
                    color = labelColor
                    textAlign = android.graphics.Paint.Align.CENTER
                    textSize = 11.sp.toPx()
                    isAntiAlias = true
                }
            )

            // Draw value label above the bar if highlighted
            if (bar.isHighlighted && barHeightPx > 0f) {
                val valueText = if (bar.value >= 1000f) "${(bar.value / 1000).toInt()}K" else "${bar.value.toInt()}"
                drawContext.canvas.nativeCanvas.drawText(
                    valueText,
                    left + barWidth / 2f,
                    top - 6f,
                    android.graphics.Paint().apply {
                        color = highlightColor.toArgb()
                        textAlign = android.graphics.Paint.Align.CENTER
                        textSize = 10.sp.toPx()
                        isAntiAlias = true
                        isFakeBoldText = true
                    }
                )
            }
        }
    }
}
