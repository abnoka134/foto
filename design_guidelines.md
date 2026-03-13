# Photo Watermark Application Design Guidelines

## Design Approach
**Utility-First Design System** - This is a focused image processing tool requiring efficiency and clarity. Design draws inspiration from modern productivity tools like Figma's clean interfaces and Canva's approachable editing tools, while maintaining the existing purple brand identity.

## Core Design Principles
1. **Processing-Focused**: Interface prioritizes the workflow from upload → customize → download
2. **Visual Feedback**: Every action provides clear visual confirmation
3. **Mobile-First**: Designed for both desktop editing and mobile photo watermarking

---

## Layout System

### Container Structure
- **Primary Container**: `max-w-2xl` centered card with elevated shadow
- **Full-Width Processing**: Upload area and canvas preview use full container width
- **Form Grid**: 2-column layout on desktop (`grid-cols-2 gap-4`), single column on mobile for date/time inputs

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Section spacing: `p-6` (mobile), `p-8` (desktop)
- Form group spacing: `gap-4` between inputs
- Component margins: `mb-6` between major sections
- Micro-spacing: `gap-2` for labels and small elements

---

## Typography Hierarchy

### Font Families (Load via CDN or local assets)
- **Display/Headings**: 'Bebas Neue' - Bold, eye-catching for headers
- **Body/Interface**: 'Roboto' - Clean, readable for labels and text
- **Emphasis**: 'Roboto Medium' - Form labels and buttons
- **Strong**: 'Roboto Condensed Bold' - Preview image overlays

### Type Scale
- **H1 (App Title)**: `text-3xl font-display tracking-wide` (Bebas Neue)
- **H2 (Section Headers)**: `text-xl font-medium` (Roboto Medium)
- **Body Text**: `text-base` (Roboto)
- **Labels**: `text-sm font-medium` (Roboto Medium)
- **Helper Text**: `text-xs text-gray-500` (Roboto)

---

## Component Library

### Upload Zone
- **Idle State**: Dashed border (`border-2 border-dashed border-gray-300`), centered icon + text, large click target (`p-12`)
- **Hover State**: Border color shifts to primary purple, background tint `bg-purple-50`
- **Dragover State**: Solid border `border-purple-500`, stronger background `bg-purple-100`
- **With Images**: Transform into horizontal scrollable gallery with image thumbnails (`aspect-square rounded-lg overflow-hidden`)

### Image Preview Cards
- **Layout**: Horizontal scroll container on mobile, 2-3 column grid on desktop
- **Card Structure**: Thumbnail image, filename overlay, remove button (X icon top-right corner)
- **Orientation Badge**: Small pill badge showing "Portrait" or "Landscape" with icon

### Form Inputs
- **Text/Date/Time Fields**: Full-width inputs with consistent `h-12` height, `rounded-lg` corners, `px-4` padding
- **Label Pattern**: Icon (emoji or SVG) + label text above input
- **Focus State**: Ring effect `focus:ring-2 focus:ring-purple-500`
- **Input Grid**: Date + Time on same row (2-column grid on desktop)

### Buttons
- **Primary Action (Process/Download)**: Full-width gradient button `bg-gradient-to-r from-purple-600 to-purple-800`, height `h-14`, medium font weight
- **Secondary Action (Download All)**: Outlined purple button or secondary gradient
- **Disabled State**: Reduced opacity `opacity-60` with cursor-not-allowed
- **Icon Integration**: Emoji or icon prefix for all major buttons (📸, 💾, 📦)

### Progress Indicator
- **Container**: Full-width thin bar `h-2 bg-gray-200 rounded-full`
- **Fill Bar**: Gradient fill `bg-gradient-to-r from-purple-500 to-purple-700` with smooth transition
- **Position**: Between form and process button, only visible during processing

### Canvas Preview
- **Layout**: Full-width container, maintains aspect ratio
- **Border**: Subtle border `border border-gray-200 rounded-lg`
- **Shadow**: Elevated when active `shadow-xl`

### Orientation Info Banner
- **Style**: Info banner with purple tint `bg-purple-50 border border-purple-200`
- **Content**: Icon + orientation text, centered
- **Position**: Above form inputs, below image previews

---

## Visual Enhancements

### Elevation & Shadows
- **Main Container**: `shadow-2xl` for prominent card elevation
- **Image Previews**: `shadow-md hover:shadow-lg` transition
- **Active Processing**: Pulsing subtle shadow during image processing

### Icons
Use **Heroicons (outline style)** via CDN for:
- Upload: cloud-arrow-up
- Calendar: calendar
- Clock: clock
- Location: map-pin
- Download: arrow-down-tray
- Close: x-mark

Fallback to emoji when icons add playful touch (current implementation already uses emojis effectively)

### Micro-interactions
- **Button Hover**: Subtle lift effect `hover:-translate-y-0.5` with shadow increase
- **Input Focus**: Smooth ring transition
- **Image Thumbnail Hover**: Scale effect `hover:scale-105 transition-transform`
- **Upload Zone Pulse**: Gentle pulse animation on first load to draw attention

---

## Images

**No hero image required** - This is a utility application where the main visual focus is user-uploaded photos and the processing interface.

**User-Generated Content Display**:
- Upload zone shows placeholder icon/illustration when empty
- Image previews display actual uploaded photos in thumbnail grid
- Canvas shows full processed image with watermark applied

---

## Mobile Optimizations

### Responsive Breakpoints
- **Mobile**: Single column, full-width inputs, stacked image previews
- **Tablet (md:)**: 2-column form grid, 2-column image grid
- **Desktop (lg:)**: Wider container `max-w-3xl`, 3-column image grid

### Touch Targets
- Minimum `h-12` for all interactive elements
- Upload zone expands to `p-16` on mobile for easier tapping
- Generous spacing between form fields `gap-6` on mobile

### Viewport Management
- Container uses responsive padding `px-4 md:px-6 lg:px-8`
- No fixed viewport heights - natural content flow
- Bottom spacing `pb-20` to ensure download buttons clear mobile keyboards

---

## Accessibility
- All inputs have visible labels (no placeholder-only fields)
- Focus states clearly visible with purple ring
- Error states use red color + descriptive text
- Progress indicator includes sr-only text updates
- File input triggered via accessible button, not hidden input only