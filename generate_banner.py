import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_banner():
    W, H = 1280, 480
    banner = Image.new('RGBA', (W, H), (20, 18, 38, 255))
    draw = ImageDraw.Draw(banner)

    # 1. Background Gradient (Deep Indigo Violet to Sakura Pink & Cyan Sky)
    for x in range(W):
        tx = x / W
        for y in range(0, H, 4):
            ty = y / H
            # Non-linear color mixing
            r = int(25 + 180 * (tx**1.2) * (1 - ty*0.5) + 30 * ty)
            g = int(22 + 50 * tx + 130 * (ty**1.5) * tx)
            b = int(45 + 120 * (1 - tx) + 160 * (tx**0.8) * ty)
            draw.rectangle([x, y, x, y + 4], fill=(min(255, r), min(255, g), min(255, b), 255))

    # 2. Dreamy background bokeh circles
    bokeh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bokeh)
    circles = [
        (250, 150, 180, (255, 120, 180, 50)),
        (400, 380, 220, (100, 190, 255, 40)),
        (950, 180, 260, (255, 100, 160, 45)),
        (1100, 360, 200, (120, 220, 255, 35)),
        (120, 400, 150, (210, 120, 255, 45)),
    ]
    for cx, cy, rad, col in circles:
        bdraw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=col)
    bokeh = bokeh.filter(ImageFilter.GaussianBlur(40))
    banner.alpha_composite(bokeh)

    # 3. Floating Anime Sakura Petals & Stars
    deco = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ddraw = ImageDraw.Draw(deco)

    def draw_star(draw, cx, cy, r_out, r_in, fill):
        pts = []
        for i in range(8):
            ang = i * math.pi / 4 - math.pi / 2
            r = r_out if i % 2 == 0 else r_in
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
        draw.polygon(pts, fill=fill)

    # Sparkling stars
    star_positions = [
        (80, 80, 14, 5), (480, 90, 16, 6), (560, 380, 12, 4),
        (1180, 90, 18, 7), (1220, 260, 14, 5), (750, 60, 12, 4),
        (880, 420, 15, 6), (1050, 70, 16, 6)
    ]
    for sx, sy, ro, ri in star_positions:
        draw_star(ddraw, sx, sy, ro, ri, (255, 255, 255, 220))
        draw_star(ddraw, sx, sy, ro + 6, ri + 2, (255, 230, 180, 80))

    # Anime sakura petals (smooth organic shapes)
    petals = [
        (150, 120, 25, 0.4), (430, 220, 22, -0.6), (520, 140, 20, 1.2),
        (820, 100, 26, -0.3), (1120, 160, 24, 0.8), (1200, 390, 20, -1.0),
        (650, 420, 22, 0.5)
    ]
    for px, py, sz, rot in petals:
        petal_img = Image.new('RGBA', (sz * 3, sz * 3), (0, 0, 0, 0))
        pdraw = ImageDraw.Draw(petal_img)
        cx, cy = sz * 1.5, sz * 1.5
        pdraw.ellipse([cx - sz, cy - sz*0.5, cx + sz, cy + sz*0.5], fill=(255, 175, 205, 190))
        pdraw.ellipse([cx - sz*0.8, cy - sz*0.4, cx + sz*0.8, cy + sz*0.4], fill=(255, 255, 255, 100))
        petal_img = petal_img.rotate(rot * 57.3, resample=Image.Resampling.BILINEAR)
        deco.alpha_composite(petal_img, (int(px - cx), int(py - cy)))

    banner.alpha_composite(deco)

    # 4. Paste Cute Mascot Icon on the Left
    icon_path = 'D:/Antigravity-work/Bilight_src/branding/anime-icon.png'
    icon = Image.open(icon_path).convert('RGBA')
    icon_resized = icon.resize((360, 360), Image.Resampling.LANCZOS)
    
    # Shadow under mascot
    icon_shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(icon_shadow).ellipse([80, 390, 460, 460], fill=(0, 0, 0, 100))
    icon_shadow = icon_shadow.filter(ImageFilter.GaussianBlur(15))
    banner.alpha_composite(icon_shadow)
    banner.alpha_composite(icon_resized, (90, 60))

    # 5. Crisp Text and Badges on the Right
    # Try finding system fonts (SimHei / YaHei / Arial)
    font_large = None
    font_sub = None
    font_badge = None
    for name in ['C:/Windows/Fonts/msyhbd.ttc', 'C:/Windows/Fonts/msyh.ttc', 'C:/Windows/Fonts/simhei.ttf']:
        try:
            font_large = ImageFont.truetype(name, 72)
            font_sub = ImageFont.truetype(name, 28)
            font_badge = ImageFont.truetype(name, 20)
            break
        except:
            pass

    if not font_large:
        font_large = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()

    tdraw = ImageDraw.Draw(banner)
    tx = 490

    # Title: Bilight
    tdraw.text((tx + 2, 110 + 2), 'Bilight', font=font_large, fill=(0, 0, 0, 90))
    tdraw.text((tx, 110), 'Bilight', font=font_large, fill=(255, 255, 255, 255))
    
    # Version badge next to title
    vbox = [tx + 250, 130, tx + 400, 168]
    tdraw.rounded_rectangle(vbox, radius=18, fill=(255, 105, 160, 220))
    tdraw.text((tx + 265, 137), 'Windows 独立版', font=font_badge, fill=(255, 255, 255, 255))

    # Subtitle
    tdraw.text((tx, 205), '搜你所想，看你所选 · 纯净无推荐 B 站桌面客户端', font=font_sub, fill=(235, 238, 255, 255))

    # Feature tags (pill badges)
    tags = ['单文件绿色即用', '4K / 60FPS 支持', '去推荐·零广告干扰', '数据完全本地隔离']
    bx = tx
    by = 270
    for tag in tags:
        bbox = tdraw.textbbox((0, 0), tag, font=font_badge)
        tw = bbox[2] - bbox[0]
        pad = 20
        badge_rect = [bx, by, bx + tw + pad*2, by + 40]
        tdraw.rounded_rectangle(badge_rect, radius=20, fill=(255, 255, 255, 30), outline=(255, 255, 255, 80), width=1)
        tdraw.text((bx + pad, by + 8), tag, font=font_badge, fill=(255, 255, 255, 240))
        bx += tw + pad*2 + 14

    # Direct tip
    tdraw.text((tx, 345), '基于原项目全新移植打包，无需配置 Docker 或 Node.js，双击直接运行。', font=font_badge, fill=(180, 190, 220, 220))

    banner.save('D:/Antigravity-work/Bilight_src/docs/assets/banner.png', 'PNG')
    print('Banner created successfully at docs/assets/banner.png')

if __name__ == '__main__':
    create_banner()
