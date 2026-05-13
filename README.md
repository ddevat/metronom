# Metronom

Webový metronom postavený na čistém HTML, CSS a JavaScriptu bez externích knihoven.

**Online verze:** https://ddevat.github.io/metronom/

## Spuštění

### Přímo v prohlížeči

Otevřete soubor `index.html` přímo v prohlížeči:

```
firefox index.html
# nebo
google-chrome index.html
# nebo dvojklikem na soubor ve správci souborů
```

### Přes lokální HTTP server

```
python3 -m http.server 8000
```

Pak otevřete v prohlížeči `http://localhost:8000`.

## Vlastnosti

- **Tempo 1–200 BPM** — nastavitelné přes wheel picker (scrollovací válec)
- **13 rytmů** — 2/2, 2/4, 3/4, 4/4, 5/4, 6/4, 7/4, 3/8, 5/8, 6/8, 7/8, 9/8, 12/8
- **Zvukové tikání** — generované přes Web Audio API, bez externích zvukových souborů
- **Tři módy beatu** — normální, akcentovaný, tlumený (bez zvuku)
- **Vizuální zpětná vazba** — aktivní beat se zvýrazní s pulzujícím efektem

## Obsluha

### Spuštění/zastavení

Klikněte na tlačítko &#9654; (play). Metronom začne tikat a postupně zvýrazňovat
jednotlivé beaty. Opětovným kliknutím (&#9632; stop) se metronom zastaví.

### Nastavení tempa

Scrollujte wheel picker nahoru/dolů pro změnu tempa. Vybraná hodnota je
zvýrazněná oranžově mezi dvěma vodorovnými čárkami. Tempo lze měnit i za běhu.

### Změna rytmu

Vyberte požadovaný rytmus z rozbalovací nabídky. Počet beatů se automaticky
upraví. Pokud metronom běží, pokračuje bez přerušení od prvního beatu.

### Módy beatu

Kliknutím na konkrétní beat (kolečko) se cyklicky mění jeho mód:

1. **Normální** (šedé orámování) — standardní tiknutí
2. **Akcentovaný** (červené orámování) — silnější tiknutí
3. **Tlumený** (tmavé orámování) — bez zvuku

První beat je ve výchozím stavu akcentovaný, ostatní normální. Při změně rytmu
se módy resetují.

## Požadavky

Moderní webový prohlížeč s podporou Web Audio API (Chrome 35+, Firefox 25+,
Safari 8+, Edge 12+).
