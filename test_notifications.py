import sys
import io
import os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

results = []

def log(msg, status="[PASS]"):
    line = f"{status} {msg}"
    print(line)
    results.append(line)

def save(page, name):
    path = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
    page.screenshot(path=path, full_page=False)
    log(f"Screenshot saved: {name}.png", "[SHOT]")
    return path

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()
    console_errors = []
    console_warnings = []
    
    page.on("console", lambda msg: (
        console_errors.append(msg.text) if msg.type == "error" else
        console_warnings.append(msg.text) if msg.type == "warning" else None
    ))

    # ===== TEST 1: HR Page loads =====
    print("\n--- TEST 1: HR Dashboard Load ---")
    try:
        page.goto(f"{BASE_URL}/Hr", wait_until="networkidle", timeout=15000)
        title = page.title()
        save(page, "01_hr_dashboard")
        log(f"HR page loaded. Title: {title}")
    except Exception as e:
        log(f"HR page load FAILED: {e}", "[FAIL]")

    # ===== TEST 2: Notification Bell =====
    print("\n--- TEST 2: Notification Bell Button ---")
    try:
        # Find the bell button - it's a button inside a div.relative in the header
        # The notification button has a title attribute set from t('notifications')
        all_header_btns = page.locator("header button").all()
        log(f"Total buttons in header: {len(all_header_btns)}")
        
        # Try finding by looking for the bell icon (button with no text, in relative div)
        bell_btn = page.locator("div.relative > button").first
        bell_count = page.locator("div.relative > button").count()
        log(f"Buttons in relative divs: {bell_count}")
        
        save(page, "02_topbar_state")
        
        if bell_count > 0:
            bell_btn.click()
            page.wait_for_timeout(600)
            save(page, "03_after_bell_click")
            log("Bell button clicked")
        else:
            log("Bell button NOT found", "[WARN]")
    except Exception as e:
        log(f"Bell button test FAILED: {e}", "[FAIL]")

    # ===== TEST 3: Check Dropdown =====
    print("\n--- TEST 3: Notification Dropdown ---")
    try:
        # Look for the notification dropdown
        dropdown = page.locator("div.absolute").filter(has=page.locator("h3")).first
        if dropdown.is_visible():
            log("Notification dropdown IS visible")
            h3_text = page.locator("h3").first.inner_text()
            log(f"Dropdown title: '{h3_text}'")
            
            # Count notification items
            items = page.locator("div.divide-y > div")
            log(f"Notification items: {items.count()}")
            save(page, "04_dropdown_content")
        else:
            # Dropdown may not be open - try clicking any relative button in header
            header_rel_btns = page.locator("header div.relative > button")
            count = header_rel_btns.count()
            log(f"Trying {count} header relative buttons...", "[WARN]")
            for i in range(count):
                btn = header_rel_btns.nth(i)
                btn.click()
                page.wait_for_timeout(400)
                if page.locator("div.absolute h3").count() > 0:
                    log(f"Dropdown found via button index {i}")
                    save(page, "04_dropdown_content")
                    break
    except Exception as e:
        log(f"Dropdown check FAILED: {e}", "[FAIL]")

    # ===== TEST 4: Mark All As Read =====
    print("\n--- TEST 4: Mark All As Read ---")
    try:
        # Try both EN and AR text
        found = False
        for text in ["Mark all as read", "تحديد الكل كمقروء", "mark"]:
            btn = page.get_by_text(text, exact=False)
            if btn.count() > 0:
                btn.first.click()
                page.wait_for_timeout(400)
                log(f"Clicked 'Mark all as read' (matched '{text}')")
                save(page, "05_after_mark_read")
                found = True
                break
        if not found:
            log("'Mark all as read' button not found (maybe no unread, or dropdown not open)", "[WARN]")
    except Exception as e:
        log(f"Mark all read FAILED: {e}", "[FAIL]")

    # ===== TEST 5: Language Switch =====
    print("\n--- TEST 5: Language Switcher ---")
    try:
        page.keyboard.press("Escape")
        page.wait_for_timeout(300)
        
        # Find language button
        lang_btn = page.locator("button").filter(has_text="EN").first
        if lang_btn.count() > 0 or page.locator("button:has-text('EN')").count() > 0:
            page.locator("button:has-text('EN')").first.click()
            page.wait_for_timeout(800)
            save(page, "06_after_lang_switch")
            log("Language switched")
        else:
            # Try the pill button with | separator
            pill = page.locator("button").filter(has_text="|").first
            if pill.count() > 0:
                pill.click()
                page.wait_for_timeout(800)
                log("Language pill clicked")
                save(page, "06_after_lang_switch")
            else:
                log("Language switcher not found", "[WARN]")
    except Exception as e:
        log(f"Language switch FAILED: {e}", "[FAIL]")

    # ===== TEST 6: Admin Page Topbar =====
    print("\n--- TEST 6: Admin Page (Topbar present?) ---")
    try:
        page.goto(f"{BASE_URL}/admin", wait_until="networkidle", timeout=15000)
        page.wait_for_timeout(500)
        
        header = page.locator("header")
        if header.count() > 0:
            log("Admin page HAS a Topbar/Header - UNIFIED LAYOUT CONFIRMED")
        else:
            log("Admin page MISSING Topbar!", "[FAIL]")
        
        save(page, "07_admin_page")
        
        # Also check HR page header
        page.goto(f"{BASE_URL}/Hr", wait_until="networkidle", timeout=10000)
        page.wait_for_timeout(300)
        hr_header = page.locator("header").count()
        log(f"HR page Topbar present: {hr_header > 0}")
        save(page, "07b_hr_topbar")
        
    except Exception as e:
        log(f"Admin page test FAILED: {e}", "[FAIL]")

    # ===== TEST 7: Mobile View =====
    print("\n--- TEST 7: Mobile Viewport (375px) ---")
    try:
        page.set_viewport_size({"width": 375, "height": 812})
        page.goto(f"{BASE_URL}/Hr", wait_until="networkidle", timeout=10000)
        page.wait_for_timeout(500)
        save(page, "08_mobile_375px")
        log("Mobile view (375px) screenshot captured")
        
        # Check bell button is still accessible on mobile
        bell_mobile = page.locator("header button").count()
        log(f"Header buttons on mobile: {bell_mobile}")
    except Exception as e:
        log(f"Mobile view FAILED: {e}", "[FAIL]")

    # ===== FINAL REPORT =====
    print("\n" + "="*55)
    print("CONSOLE ERRORS:")
    if console_errors:
        for e in console_errors[:10]:
            print(f"  [ERROR] {e}")
    else:
        print("  [PASS] No console errors")
    
    print("\nCONSOLE WARNINGS:")
    react_warnings = [w for w in console_warnings if "Warning" in w or "key" in w]
    if react_warnings:
        for w in react_warnings[:5]:
            print(f"  [WARN] {w}")
    else:
        print("  [PASS] No critical console warnings")

    print(f"\nSCREENSHOTS LOCATION: {SCREENSHOTS_DIR}")
    print("\nTEST RESULTS SUMMARY:")
    for r in results:
        print(f"  {r}")
    
    browser.close()
    print("\n[DONE] All tests completed.")
