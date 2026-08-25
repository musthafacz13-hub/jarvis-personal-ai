from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
OUTPUT = "/home/ubuntu/webdev-static-assets/jarvis-icon-compact.png"


def blend(a, b, fraction):
    return tuple(round(a[index] + (b[index] - a[index]) * fraction) for index in range(3))


def main():
    background = Image.new("RGB", (SIZE, SIZE))
    pixels = background.load()
    center = SIZE / 2
    max_distance = (2 * (center**2)) ** 0.5
    for y in range(SIZE):
        for x in range(SIZE):
            dx, dy = x - center, y - center
            distance = (dx * dx + dy * dy) ** 0.5 / max_distance
            radial = max(0, 1 - distance * 1.35)
            pixels[x, y] = blend((5, 13, 29), (10, 42, 70), radial)

    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((190, 190, 834, 834), outline=(31, 219, 255, 220), width=36)
    glow = glow.filter(ImageFilter.GaussianBlur(38))
    background = Image.alpha_composite(background.convert("RGBA"), glow)

    drawing = ImageDraw.Draw(background)
    drawing.ellipse((220, 220, 804, 804), fill=(8, 28, 49, 230), outline=(75, 230, 255, 255), width=20)
    drawing.ellipse((256, 256, 768, 768), outline=(27, 115, 153, 255), width=3)
    drawing.ellipse((292, 292, 732, 732), outline=(51, 170, 200, 180), width=3)

    line_y = 512
    points = []
    waveform = [0, 0, 12, -18, 28, -48, 112, -212, 240, -130, 58, -22, 0, 22, -58, 130, -240, 212, -112, 48, -28, 18, -12, 0, 0]
    start_x = 322
    step = 16
    for index, value in enumerate(waveform):
        points.append((start_x + index * step, line_y - value))
    drawing.line((286, line_y, 322, line_y), fill=(78, 233, 255, 210), width=9)
    drawing.line(points, fill=(104, 241, 255, 255), width=13, joint="curve")
    drawing.line((706, line_y, 738, line_y), fill=(78, 233, 255, 210), width=9)
    drawing.ellipse((493, 493, 531, 531), fill=(225, 254, 255, 255))
    drawing.ellipse((503, 503, 521, 521), fill=(22, 154, 190, 255))

    background.convert("RGB").save(OUTPUT, "PNG", optimize=True, compress_level=9)


if __name__ == "__main__":
    main()
