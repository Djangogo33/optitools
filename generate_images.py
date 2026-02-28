#!/usr/bin/env python3
"""
Generate PNG images for TutoFacile tutorials
Creates colored gradient images for each tutorial
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Define output directory
output_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(output_dir, 'images')

# Create images directory if it doesn't exist
os.makedirs(images_dir, exist_ok=True)

# Tutorial image configurations
tutorials = [
    {
        'id': 1,
        'filename': 'tuto-1-flexbox.png',
        'gradient_start': (0, 105, 246),      # Blue #0069f6
        'gradient_end': (0, 196, 167),        # Teal #00c4a7
        'text': 'CSS',
        'emoji': None
    },
    {
        'id': 2,
        'filename': 'tuto-2-cookies.png',
        'gradient_start': (34, 197, 94),      # Green #22c55e
        'gradient_end': (245, 158, 11),       # Amber #f59e0b
        'text': '🍪',
        'emoji': True
    },
    {
        'id': 3,
        'filename': 'tuto-3-nodejs.png',
        'gradient_start': (0, 105, 246),      # Blue #0069f6
        'gradient_end': (94, 45, 253),        # Purple #5e2dfd
        'text': 'N',
        'emoji': None
    },
    {
        'id': 4,
        'filename': 'tuto-4-tomates.png',
        'gradient_start': (239, 68, 68),      # Red #ef4444
        'gradient_end': (245, 158, 11),       # Amber #f59e0b
        'text': '🍅',
        'emoji': True
    },
    {
        'id': 5,
        'filename': 'tuto-5-chocolate.png',
        'gradient_start': (139, 69, 19),      # Brown #8b4513
        'gradient_end': (210, 105, 30),       # Chocolate #d2691e
        'text': '🍫',
        'emoji': True
    },
]

def create_gradient_image(width, height, start_color, end_color):
    """Create an image with a linear gradient from top-left to bottom-right"""
    img = Image.new('RGB', (width, height))
    pixels = img.load()
    
    for y in range(height):
        for x in range(width):
            # Calculate gradient position (0.0 to 1.0)
            ratio = (x + y) / (width + height)
            
            # Interpolate color
            r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
            g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
            b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
            
            pixels[x, y] = (r, g, b)
    
    return img

def generate_images():
    """Generate all tutorial images"""
    for tutorial in tutorials:
        print(f"Generating {tutorial['filename']}...", end=' ')
        
        # Create gradient background
        img = create_gradient_image(400, 300, tutorial['gradient_start'], tutorial['gradient_end'])
        draw = ImageDraw.Draw(img)
        
        # Add text/emoji in center
        text = tutorial['text']
        font_size = 80 if tutorial['emoji'] else 60
        
        try:
            # Try to use a default system font
            if tutorial['emoji']:
                # For emoji, use larger default font
                font = ImageFont.load_default()
            else:
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
        
        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (400 - text_width) // 2
        y = (300 - text_height) // 2
        
        # Draw text in white
        draw.text((x, y), text, fill=(255, 255, 255), font=font)
        
        # Save image
        filepath = os.path.join(images_dir, tutorial['filename'])
        img.save(filepath, 'PNG')
        
        print(f"✅ Saved to {filepath}")

if __name__ == '__main__':
    try:
        generate_images()
        print("\n✅ All images generated successfully!")
    except Exception as e:
        print(f"\n❌ Error generating images: {e}")
        import traceback
        traceback.print_exc()
