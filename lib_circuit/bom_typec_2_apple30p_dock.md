# USB Type-C to Apple retro 30-pin
```diff
+ Last Update: 2022.06.30
- Signal integrity issues spotted, building is not advised.
```

## Circuit diagram
![](https://github.takahashi65.info/lib_img/github_gerber_usbc2apple_schematic.webp)

## Board preview
![](https://github.takahashi65.info/lib_img/github_gerber_usbc2apple_front.webp)  
![](https://github.takahashi65.info/lib_img/github_gerber_usbc2apple_rear.webp)  

### Bill of materials
| Component| Manufacturer and part number | Description | Amount |
| :-: | :- | :- | -: |
| AudioJack | CUI, SJ1-3533NG | Connector, Audio jack, 3.5mm | 2 |
| TYPE_C1 | GCT, USB4085-GF-A | Type-C Connector, Female socket, USB 2.0 | 1 |
| SERIAL1 | | 1x03, Pin header, Female, 2.54mm, Horizontal | 1 |
| ESD1 | STMicroelectronics, USBLC6-4SC6 | ESD suppressors, SOT-23-6 | 1 |
| CC1-CC2 | | 5.11 kOhm, SMD resistor, 0805_2012 | 2 |
| Acc1 | | 1 MOhm, SMD resistor, 0805_2012 | 1 |
| EMI1 | Wurth Elektronik, 74279208 | EMI suppression, Ferrite beads, 0805_2012 | 1 |
| C1 | | 100nF, SMD Capacitor, 0805_2012 | 1 |
| IPOD1 | eLabBay, APPLE-30M-BO-V1AV |  Apple 30-pin plug, Male, vertical | 1 |
| Total | | | 11 |
