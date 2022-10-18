# NE555, PWM Fan speed controller
```diff
+ Last Update: 2022.06.11
```

## Board preview
![](https://github.takahashi65.info/lib_img/github_gerber_ne555_pwm_front.webp)  
![](https://github.takahashi65.info/lib_img/github_gerber_ne555_pwm_rear.webp)  

### Bill of materials  
| Component| Manufacturer and part number | Description | Amount |
| :-: | :- | :- | -: |
| Power1 | Wurth Elektronik, 61900311121 | 1x03, Male, 2.54mm | 1 |
| F1-F2 | CUI Devices, PJ-102AH | 5A, 24V, ID: 2mm, OD: 6.5mm | 2 |
| T1 | Central Semiconductor, 2N3904 | Bipolar Transistor | 1 |
| T2 | STMicroelectronics, TIP127 | PNP Power Darlington, TO-220 | 1 |
| T2 | Aavid, 577002B00000G | Aluminum heat sinks, 13 mm | 1 | 
| U1 | Texas Instruments, NE555P | Timer IC, DIP-8 | 1 |
| U1 | Mill-Max, 110-41-308-41-001000 | DIP Sockets, 02x04 | 1 |
| D1 | Diodes Incorporated, 1N4001-T | Diode, Vr/50V Io, 1A, T/R, L: 4.7mm | 1 |
| D2-D4 | STMicroelectronics, 1N5817 | Diode, Vr/20V Io, 1A, L: 5.2mm | 3 |
| R1 | Yageo, MFP-25BRD52-10K | 1/4W, 10K Ohm, Tolerance: 0.1%, L: 6.3mm | 1 |
| R2 | Yageo, CFR-25JT-52-100K | 1/4W, 100K Ohm, Tolerance: 5%, L: 6.3mm | 1 |
| R3 | Yageo, CFR50SJT-52-1K | 1/2W, 1K Ohm, Tolerance: 5%, L: 6.3mm | 1 |
| R4 | Yageo, CFR-25JT-52-47K | 1/4W, 47K Ohm, Tolerance: 5%, L: 6.3mm | 1 |
| C1 | EPCOS/TDK, B41896C6337M000 | 330uF, 50V, P: 5mm | 1 |
| C2 | Panasonic, EEU-FR1H100B | 10uF, 50V, P: 5mm | 1 |
| C3,C5 | Murata, RDE5C1H104J2K1H03B | 0.1 uF, 50V, MLCC | 2 |
| C4 | Murata, RDER73A103K2K1H03B | 0.01 uF, MLCC, 5mm | 1 |
| RV1 | Bourns, 3006P-7-104LF | Potentiometer, 100K Ohm, Tolerance: 10% | 1 |
| SW1 | C&K, BD01 | DIP/SIP Switch, SPST, 1P | 1 |
| Total | | | 23 |
