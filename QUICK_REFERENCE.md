# 🎯 Quick Reference - Tutorial Creation System

## ⚡ Quick Start

### Login & Navigate
1. Go to admin panel
2. Login with your credentials
3. Click **"➕ Créer un tutoriel"** in sidebar

### Create Tutorial
1. **Fill Form:**
   - Titre *
   - Description *
   - Catégorie *
   - Difficulté *
   - Durée (minutes) *
   - URL (auto-filled)

2. **Build Content:**
   - Click [+ Texte] / [+ Image] / [+ Titre] / [+ Liste]
   - Enter content when prompted
   - Element appears in builder

3. **Arrange Content:**
   - Drag elements by ≡ handle
   - Reorder as needed

4. **Save:**
   - Click [💾 Créer le tutoriel]
   - See success message
   - Auto-redirect to dashboard

## 📝 Element Types

| Type | Button | Color | What to Enter | Result |
|------|--------|-------|---------------|--------|
| Text | [+ Texte] | #4ecdc4 | Your text | Text paragraph |
| Image | [+ Image] | #2196F3 | Image URL | Image reference |
| Title | [+ Titre] | #FF9800 | Title text | Formatted header |
| List | [+ Liste] | #9C27B0 | item1, item2, item3 | Bullet list |

## 🎮 Controls

### Add Element
```
1. Click button [+ Type]
2. Type content in prompt
3. Element appears in builder
```

### Reorder Elements
```
1. Hover over element
2. Click ≡ (left side)
3. Drag up/down
4. Release to drop
```

### Delete Element
```
1. Click ❌ button on element
2. Element removed
```

### Edit Element (Future)
```
1. Click ✏️ button on element
2. (Edit functionality coming)
```

## ✅ Validation Rules

**Required Fields:**
- ✓ Title (not empty)
- ✓ Description (not empty)
- ✓ Category (must select)
- ✓ Difficulty (must select)
- ✓ Duration (must enter)

**Content:**
- ✓ At least 1 element required
- ✓ Any element type is valid

**Auto-Generation:**
- URL auto-generated from title if not provided
- Example: "How to Paint" → "/pages/tuto-how-to-paint.html"

## 💾 What Gets Saved

✅ All form data
✅ All content elements
✅ Element order
✅ Creation timestamp
✅ Unique ID

## 📊 Where Tutorials Appear

| Location | What You See |
|----------|--------------|
| Dashboard | Recent tutorials (5 most recent) |
| Tutoriels tab | All custom tutorials |
| Statistics | Count in total |
| Export | Included in backup |

## 🎨 Buttons Reference

```
Creation Form:
├─ [+ Texte]              Green button - Add text
├─ [+ Image]              Blue button - Add image URL
├─ [+ Titre]              Orange button - Add title
├─ [+ Liste]              Purple button - Add list
└─ [💾 Créer le tutoriel] Blue button - Save & submit

Element Controls:
├─ ≡                      Handle - Drag to reorder
├─ ✏️                      Edit button - Future feature
└─ ❌                      Delete button - Remove element
```

## 🌙 Dark Mode

- Everything works the same
- Colors adjusted for readability
- No additional steps needed

## 🔄 Workflow Diagram

```
START
  ↓
Admin → Créer tutoriel
  ↓
Fill Form (Title, Description, etc.)
  ↓
Add Elements ([+ Texte], [+ Image], etc.)
  ↓
Reorder (Drag & Drop)
  ↓
Review
  ↓
[💾 Créer le tutoriel]
  ↓
Validate
  ↓
Save → localStorage
  ↓
Success ✅
  ↓
Redirect → Dashboard
  ↓
END
```

## ❓ FAQ

**Q: Do I have to provide a URL?**
A: No, it's auto-generated from your title.

**Q: Can I have just one element?**
A: Yes, minimum is 1 element.

**Q: Can I delete an element?**
A: Yes, click ❌ button on it.

**Q: Can I reorder elements?**
A: Yes, drag by ≡ handle.

**Q: Where is my tutorial saved?**
A: In browser localStorage and visible on dashboard.

**Q: Can I edit after creating?**
A: Yes, in "Tutoriels" tab (edit feature coming).

**Q: Does dark mode affect my content?**
A: No, it just changes the colors for readability.

## 📱 Mobile Usage

Everything works on mobile:
- Touch-friendly buttons
- Responsive form layout
- Touch drag & drop supported
- Single column layout

## 🔐 Security Notes

- Data saved locally in browser
- Use Export feature to backup
- Clearing browser data will delete tutorials
- Use Import to restore from backup

## ⚙️ Settings

**Export Data:**
1. Go to Paramètres tab
2. Click "Exporter les données"
3. Save JSON file

**Import Data:**
1. Go to Paramètres tab
2. Click "Importer les données"
3. Select JSON file
4. Data restored

## 📞 Troubleshooting

**Form won't submit?**
- Check all * fields are filled
- Check at least 1 element added

**Element won't drag?**
- Click ≡ handle specifically
- Make sure element is in builder

**Can't add element?**
- Check URL field (if it's an image)
- Enter content when prompted

**Dark mode looks odd?**
- Refresh page
- Clear browser cache

---

**Quick Reference Sheet - Keep Handy! 📌**
