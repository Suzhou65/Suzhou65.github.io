# FFmpeg command gist
## Split VR video to stander
```
ffmpeg -i input.mp4 -filter:v "crop=1920:1080:0:0" output.mp4
```

## Lens correction
### GoPro 2
```
ffmpeg -i input.mp4 -vf "lenscorrection=cx=0.5:cy=0.5:k1=-0.227:k2=-0.022" output_gp2.mp4
```

### GoPro 3+
```
ffmpeg -i input.mp4 -vf "lenscorrection=0.5:0.5:-0.335:0.097" output_gp3_plus.mp4
```

### GoPro Hero 5 & 6
```
ffmpeg -i input.mp4 -vf "lenscorrection=k2=0.006:k1=-0.18" output_gp5_gp6.mp4
```

## Specify time line
```
ffmpeg -ss 00:00:00 -i input.mp4 -to 00:02:00
```