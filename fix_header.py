with open('src/components/boutique/header.tsx', 'r') as f:
    content = f.read()
content = content.replace('obileOpen, setMobileOpen]', '[mobileOpen, setMobileOpen]')
with open('src/components/boutique/header.tsx', 'w') as f:
    f.write(content)
print('Done')
