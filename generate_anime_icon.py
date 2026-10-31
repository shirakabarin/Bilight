import math
from PIL import Image, ImageDraw, ImageFilter

def create_anime_icon():
    W, H = 1024, 1024
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    
    # 1. Background Badge: Dreamy Anime Squircle
    # Outer Glow / Soft Drop Shadow
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    for i in range(50, 0, -2):
        alpha = int(45 * (1 - i / 50)**1.5)
        sdraw.rounded_rectangle([70 - i, 80 - i, 954 + i, 964 + i], radius=240 + i, fill=(255, 105, 180, alpha))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    img.alpha_composite(shadow)

    # Main Badge Gradient (Magic Sakura Pink -> Dream Violet -> Sky Cyan)
    badge = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge)
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle([70, 70, 954, 954], radius=240, fill=255)

    for y in range(70, 955):
        t = (y - 70) / (954 - 70)
        # Triple-stop gradient: Pink (255, 115, 165) -> Orchid (190, 120, 245) -> Cyan Blue (100, 210, 255)
        if t < 0.5:
            st = t / 0.5
            r = int(255 * (1 - st) + 195 * st)
            g = int(110 * (1 - st) + 125 * st)
            b = int(170 * (1 - st) + 245 * st)
        else:
            st = (t - 0.5) / 0.5
            r = int(195 * (1 - st) + 90 * st)
            g = int(125 * (1 - st) + 205 * st)
            b = int(245 * (1 - st) + 255 * st)
        bdraw.line([(70, y), (954, y)], fill=(r, g, b, 255), width=1)
    
    # Glass Edge Highlight on Badge
    edge_highlight = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ehdraw = ImageDraw.Draw(edge_highlight)
    ehdraw.rounded_rectangle([72, 72, 952, 952], radius=238, outline=(255, 255, 255, 160), width=6)
    ehdraw.arc([75, 75, 949, 450], start=180, end=0, fill=(255, 255, 255, 220), width=10)
    
    badge = Image.composite(badge, Image.new('RGBA', (W, H), (0, 0, 0, 0)), mask)
    badge.alpha_composite(edge_highlight)
    img.alpha_composite(badge)

    # 2. Cute Anime Cat-Ear Antennas
    antenna = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    adraw = ImageDraw.Draw(antenna)
    # Left cat ear antenna
    adraw.polygon([(360, 310), (300, 180), (450, 280)], fill=(255, 255, 255, 255))
    adraw.polygon([(360, 290), (320, 205), (420, 275)], fill=(255, 140, 185, 240))
    # Right cat ear antenna
    adraw.polygon([(664, 310), (724, 180), (574, 280)], fill=(255, 255, 255, 255))
    adraw.polygon([(664, 290), (704, 205), (604, 275)], fill=(255, 140, 185, 240))
    # Golden star antenna ornament on the right ear
    def draw_star(draw, cx, cy, r_out, r_in, fill):
        pts = []
        for i in range(10):
            ang = i * math.pi / 5 - math.pi / 2
            r = r_out if i % 2 == 0 else r_in
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
        draw.polygon(pts, fill=fill)
    draw_star(adraw, 730, 180, 48, 22, (255, 235, 90, 255))
    draw_star(adraw, 730, 180, 24, 11, (255, 255, 255, 240))

    img.alpha_composite(antenna)

    # 3. Mascot TV Body (Pure White, Rounded with Soft Occlusion)
    tv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tv)
    # TV drop shadow on badge
    tv_shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(tv_shadow).rounded_rectangle([200, 290, 824, 780], radius=110, fill=(60, 30, 80, 90))
    tv_shadow = tv_shadow.filter(ImageFilter.GaussianBlur(16))
    img.alpha_composite(tv_shadow)

    # Outer TV white case
    tdraw.rounded_rectangle([210, 280, 814, 770], radius=105, fill=(255, 255, 255, 255))
    # TV bottom rim cel-shade
    tdraw.rounded_rectangle([210, 680, 814, 770], radius=105, fill=(240, 242, 250, 255))
    tdraw.rounded_rectangle([210, 280, 814, 755], radius=105, fill=(255, 255, 255, 255))

    # Inner Screen (Deep vibrant navy/purple anime screen)
    screen_rect = [252, 322, 772, 728]
    tdraw.rounded_rectangle(screen_rect, radius=75, fill=(35, 34, 58, 255))

    # Screen gradient sheen
    screen_mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(screen_mask).rounded_rectangle(screen_rect, radius=75, fill=255)
    screen_glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sgdraw = ImageDraw.Draw(screen_glow)
    sgdraw.ellipse([150, 200, 874, 550], fill=(255, 255, 255, 45))
    screen_glow = Image.composite(screen_glow, Image.new('RGBA', (W, H), (0, 0, 0, 0)), screen_mask)
    tv.alpha_composite(screen_glow)

    # 4. Super Cute Anime Eyes & Expression
    # Left Eye: Sparkling Anime Eye
    # Eye whites/outer
    tdraw.ellipse([345, 435, 445, 555], fill=(255, 255, 255, 255))
    # Eye iris (vibrant pink & sky blue gradient)
    tdraw.ellipse([350, 442, 440, 550], fill=(255, 80, 145, 255))
    tdraw.ellipse([355, 470, 435, 545], fill=(100, 210, 255, 255))
    tdraw.ellipse([370, 465, 420, 525], fill=(30, 25, 50, 255))
    # Eye large highlight
    tdraw.ellipse([365, 448, 395, 482], fill=(255, 255, 255, 255))
    tdraw.ellipse([405, 505, 422, 522], fill=(255, 255, 255, 230))
    # Eye lashes
    tdraw.arc([335, 420, 455, 470], start=190, end=350, fill=(35, 30, 55, 255), width=8)

    # Right Eye: Happy Wink (Anime style ^_~)
    tdraw.arc([575, 450, 685, 540], start=195, end=345, fill=(255, 255, 255, 255), width=18)
    tdraw.arc([575, 450, 685, 540], start=195, end=345, fill=(255, 95, 160, 255), width=12)
    # Wink heart sparkle
    draw_star(tdraw, 695, 445, 24, 10, (255, 235, 90, 255))

    # Cute Anime Blush (Soft Pink Radial gradient on cheeks)
    blush = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bldraw = ImageDraw.Draw(blush)
    for r in range(45, 0, -2):
        ba = int(120 * (1 - r / 45)**1.2)
        bldraw.ellipse([310 - r, 545 - int(r*0.6), 310 + r, 545 + int(r*0.6)], fill=(255, 75, 130, ba))
        bldraw.ellipse([710 - r, 545 - int(r*0.6), 710 + r, 545 + int(r*0.6)], fill=(255, 75, 130, ba))
    tv.alpha_composite(blush)

    # Cute Open Smile Mouth (Chibi anime style)
    # Mouth outline
    tdraw.pieslice([475, 520, 550, 590], start=0, end=180, fill=(255, 85, 130, 255))
    # Mouth tongue
    tdraw.pieslice([490, 545, 535, 590], start=0, end=180, fill=(255, 180, 205, 255))

    # Little floating anime stars
    draw_star(tdraw, 215, 260, 32, 14, (255, 255, 255, 240))
    draw_star(tdraw, 825, 700, 28, 12, (255, 255, 255, 230))
    draw_star(tdraw, 790, 240, 22, 9, (255, 235, 90, 240))

    img.alpha_composite(tv)

    # 5. Export high-res PNG and multi-resolution ICO
    out_png = 'D:/Antigravity-work/Bilight_src/branding/anime-icon.png'
    out_ico = 'D:/Antigravity-work/Bilight_src/branding/anime-icon.ico'
    img.save(out_png, 'PNG')
    
    # Generate ICO with standard sizes: 256, 128, 64, 48, 32, 16
    sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    icon_images = [img.resize(s, Image.Resampling.LANCZOS) for s in sizes]
    icon_images[0].save(out_ico, format='ICO', sizes=sizes, append_images=icon_images[1:])
    print('Generated anime icons successfully!')

if __name__ == '__main__':
    create_anime_icon()
