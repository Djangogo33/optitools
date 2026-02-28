# Guide: Convertir les SVG en PNG

Les fichiers SVG sont déjà dans le dossier `images/`. Pour les convertir en PNG, voici les meilleures options :

## ✅ Option 1: Convertisseur en ligne (FACILE)

1. Allez sur: https://cloudconvert.com/svg-to-png
2. Uploadez chaque fichier SVG depuis `images/`
3. Téléchargez le PNG correspondant
4. Sauvegardez-le dans le même dossier `images/`

**Fichiers à convertir:**
- images/tuto-1-flexbox.svg → tuto-1-flexbox.png
- images/tuto-2-cookies.svg → tuto-2-cookies.png
- images/tuto-3-nodejs.svg → tuto-3-nodejs.png
- images/tuto-4-tomates.svg → tuto-4-tomates.png
- images/tuto-5-chocolate.svg → tuto-5-chocolate.svg

## ✅ Option 2: ImageMagick (RECOMMANDÉ)

### Installation
1. Téléchargez ImageMagick: https://imagemagick.org/script/download.php
2. Installez-le en sélectionnant "Install development headers and libraries"

### Utilisation
Ouvrez PowerShell dans le dossier `tutofacile` et exécutez:

```powershell
magick convert images/tuto-1-flexbox.svg images/tuto-1-flexbox.png
magick convert images/tuto-2-cookies.svg images/tuto-2-cookies.png
magick convert images/tuto-3-nodejs.svg images/tuto-3-nodejs.png
magick convert images/tuto-4-tomates.svg images/tuto-4-tomates.png
magick convert images/tuto-5-chocolate.svg images/tuto-5-chocolate.png
```

Ou en une seule ligne:
```powershell
Get-ChildItem images/*.svg | ForEach-Object { magick convert $_.FullName $_.DirectoryName/$($_.BaseName).png }
```

## ✅ Option 3: Utiliser GIMP (GUI)

1. Téléchargez GIMP: https://www.gimp.org/
2. Ouvrez chaque SVG dans GIMP
3. Exportez en PNG (File > Export As)

## ✅ Option 4: Utiliser Inkscape

1. Téléchargez Inkscape: https://inkscape.org/
2. Ouvrez et convertissez:

```powershell
inkscape images/tuto-1-flexbox.svg --export-png=images/tuto-1-flexbox.png
inkscape images/tuto-2-cookies.svg --export-png=images/tuto-2-cookies.png
# etc...
```

## 📝 Après conversion

Une fois les PNG créés, mets à jour `data.json`:

```json
{
  "image": "images/tuto-1-flexbox.png",
  ...
}
```

Les images PNG seront affichées correctement sur le site et sur Discord! 🎉

## 🎨 Alternative: Utiliser les SVG directement

Les fichiers SVG fonctionnent parfaitement sur le web et dans Discord!
Si tu veux garder les SVG, c'est OK - ils s'affichent bien.

Les PNG offrent juste une meilleure compatibilité avec certains navigateurs très vieux.
