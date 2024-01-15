(function (Peaks) {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext();
  var renderSegments = function (peaks) {
    var segmentsContainer = document.getElementById("segments");
    var segments = peaks.segments.getSegments();
    var html = "";

    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];

      var row =
        "<tr>" +
        "<td>" +
        segment.id +
        "</td>" +
        '<td><input data-action="update-segment-label" type="text" value="' +
        segment.labelText +
        '" data-id="' +
        segment.id +
        '"/></td>' +
        '<td><input data-action="update-segment-start-time" type="number" value="' +
        segment.startTime +
        '" data-id="' +
        segment.id +
        '"/></td>' +
        '<td><input data-action="update-segment-end-time" type="number" value="' +
        segment.endTime +
        '" data-id="' +
        segment.id +
        '"/></td>' +
        "<td>" +
        '<a href="#' +
        segment.id +
        '" data-action="play-segment" data-id="' +
        segment.id +
        '">Play</a>' +
        "</td>" +
        "<td>" +
        '<a href="#' +
        segment.id +
        '" data-action="loop-segment" data-id="' +
        segment.id +
        '">Loop</a>' +
        "</td>" +
        "<td>" +
        '<a href="#' +
        segment.id +
        '" data-action="remove-segment" data-id="' +
        segment.id +
        '">Remove</a>' +
        "</td>" +
        "</tr>";

      html += row;
    }

    segmentsContainer.querySelector("tbody").innerHTML = html;

    if (html.length) {
      segmentsContainer.classList.remove("hide");
    }

    document
      .querySelectorAll('input[data-action="update-segment-start-time"]')
      .forEach(function (inputElement) {
        inputElement.addEventListener("input", function (event) {
          var element = event.target;
          var id = element.getAttribute("data-id");
          var segment = peaks.segments.getSegment(id);

          if (segment) {
            var startTime = parseFloat(element.value);

            if (startTime < 0) {
              startTime = 0;
              element.value = 0;
            }

            if (startTime >= segment.endTime) {
              startTime = segment.endTime - 0.1;
              element.value = startTime;
            }

            segment.update({ startTime: startTime });
          }
        });
      });

    document
      .querySelectorAll('input[data-action="update-segment-end-time"]')
      .forEach(function (inputElement) {
        inputElement.addEventListener("input", function (event) {
          var element = event.target;
          var id = element.getAttribute("data-id");
          var segment = peaks.segments.getSegment(id);

          if (segment) {
            var endTime = parseFloat(element.value);

            if (endTime < 0) {
              endTime = 0;
              element.value = 0;
            }

            if (endTime <= segment.startTime) {
              endTime = segment.startTime + 0.1;
              element.value = endTime;
            }

            segment.update({ endTime: endTime });
          }
        });
      });

    document
      .querySelectorAll('input[data-action="update-segment-label"]')
      .forEach(function (inputElement) {
        inputElement.addEventListener("input", function (event) {
          var element = event.target;
          var id = element.getAttribute("data-id");
          var segment = peaks.segments.getSegment(id);
          var labelText = element.labelText;

          if (segment) {
            segment.update({ labelText: labelText });
          }
        });
      });
  };

  var renderPoints = function (peaks) {
    var pointsContainer = document.getElementById("points");
    var points = peaks.points.getPoints();
    var html = "";

    for (var i = 0; i < points.length; i++) {
      var point = points[i];

      var row =
        "<tr>" +
        "<td>" +
        point.id +
        "</td>" +
        '<td><input data-action="update-point-label" type="text" value="' +
        point.labelText +
        '" data-id="' +
        point.id +
        '"/></td>' +
        '<td><input data-action="update-point-time" type="number" value="' +
        point.time +
        '" data-id="' +
        point.id +
        '"/></td>' +
        "<td>" +
        '<a href="#' +
        point.id +
        '" data-action="remove-point" data-id="' +
        point.id +
        '">Remove</a>' +
        "</td>" +
        "</tr>";

      html += row;
    }

    pointsContainer.querySelector("tbody").innerHTML = html;

    if (html.length) {
      pointsContainer.classList.remove("hide");
    }

    document
      .querySelectorAll('input[data-action="update-point-time"]')
      .forEach(function (inputElement) {
        inputElement.addEventListener("input", function (event) {
          var element = event.target;
          var id = element.getAttribute("data-id");
          var point = peaks.points.getPoint(id);

          if (point) {
            var time = parseFloat(element.value);

            if (time < 0) {
              time = 0;
              element.value = 0;
            }

            point.update({ time: time });
          }
        });
      });

    document
      .querySelectorAll('input[data-action="update-point-label"]')
      .forEach(function (inputElement) {
        inputElement.addEventListener("input", function (event) {
          var element = event.target;
          var id = element.getAttribute("data-id");
          var point = peaks.points.getPoint(id);
          var labelText = element.labelText;

          if (point) {
            point.update({ labelText: labelText });
          }
        });
      });
  };

  var options = {
    containers: {
      zoomview: document.getElementById("zoomview-container"),
      overview: document.getElementById("overview-container")
    },
    mediaElement: document.getElementById("audio"),
    webAudio: {
      audioContext: audioContext
    },
    keyboard: true,
    playedWaveformColor: 'rgba(0, 225, 128, 1)',
    pointMarkerColor: "#006eb0",
    showPlayheadTime: true,
    waveformCache: true,
    zoomLevels: [512, 1024, 2048, 4096],
    segmentOptions: {
      markers: false,
      overlay: true,
      waveformColor: "#e30b21",
      overlayColor: "#29a9f2",
      overlayOpacity: 0.3,
      overlayBorderColor: "#ff0000",
      overlayBorderWidth: 2,
      overlayCornerRadius: 5,
      overlayOffset: 40,
      overlayLabelAlign: "left",
      overlayLabelVerticalAlign: "top",
      overlayLabelPadding: 8,
      overlayLabelColor: "#000000",
      overlayFontFamily: "sans-serif",
      overlayFontSize: 14,
      overlayFontStyle: "normal"
    },

    segments: [
      {
        startTime: 0.0,
        endTime: 111.0,
        editable: true,
        color: "#1be02f",
        labelText: "Intro"
      },
         {
        startTime: 111.0,
        endTime: 703.5,
        editable: true,
        color: "#E7003E",
        labelText: "Main"
      },
    
  
      {
        startTime: 703.5,
        endTime: 752.0,
        editable: true,
        color: "#29a9f2",
        labelText: "Guitar solo"
         },
         {
        startTime:800.5,
        endTime: 909.0,
        editable: true,
        color: "#29a9f2",
        labelText: "Outro"
         },
    ]
  };

  Peaks.init(options, function(err, peaks) {
    document.getElementById("zoomIn").addEventListener("click", function() {
      peaks.zoom.zoomIn();
    });

    document.getElementById("zoomOut").addEventListener("click", function() {
      peaks.zoom.zoomOut();
    });

    document.getElementById("segment").addEventListener("click", function() {
      var startTime = peaks.player.getCurrentTime();
      var endTime = startTime + 10;

      peaks.segments.add({
        startTime: startTime,
        endTime:   endTime,
        editable:  true
      });
    });

    document.getElementById("point").addEventListener("click", function() {
      var time = peaks.player.getCurrentTime();

      peaks.points.add({
        time:     time,
        editable: true,
        color:    "#006EB0"
      });
    });
  });
})(peaks);
/**
 * for documentation and more demos,
 * visit https://audiomotion.dev
 */

// load module from Skypack CDN
import AudioMotionAnalyzer from "https://cdn.skypack.dev/audiomotion-analyzer";
import peaksJs from "https://esm.sh/peaks.js";

// audio source
const audioEl = document.getElementById("audio");

// container
const container = document.getElementById("container");

// instantiate analyzer
const audioMotion = new AudioMotionAnalyzer(container, {
  source: audioEl,
  mode: 10,
  channelLayout: "dual-combined",
  fillAlpha: 0.3,
  fsElement: container,
  frequencyScale: "bark",
  gradientLeft: "steelblue",
  gradientRight: "orangered",
  linearAmplitude: true,
  linearBoost: 1.8,
  lineWidth: 1.5,
  showPeaks: false,
  outlineBars: true,
  weightingFilter: "D"
});

// file upload
document.getElementById("upload").addEventListener("change", (e) => {
  const fileBlob = e.target.files[0];

  if (fileBlob) {
    audioEl.src = URL.createObjectURL(fileBlob);
    audioEl.play();
  }
});

/* ======== CONTROLS (dat-gui) ======== */

const gui = new dat.GUI({ autoPlace: false });

const buttons = {
  //  link: () => window.parent.location = 'https://audiomotion.dev',
  link: () =>
    (window.parent.location =
      "https://github.com/hvianna/audioMotion-analyzer/tree/develop#readme"),
  loadFile: () => document.getElementById("upload").click(),
  playStream: () => {
    audioEl.src = "https://icecast2.ufpel.edu.br/live";
    audioEl.play();
  },
  fullscreen: () => audioMotion.toggleFullscreen()
};

gui.add(buttons, "loadFile").name("Upload audio file");
gui.add(buttons, "playStream").name("Play live stream");
gui.add(buttons, "fullscreen").name("Fullscreen");

gui.add(audioMotion, "gradient", [
  "classic",
  "prism",
  "orangered",
  "rainbow",
  "steelblue"
]);

gui.add(audioMotion, "mode", {
  "Discrete frequencies": 0,
  "1/24th octave / 240 bands": 1,
  "1/12th octave / 120 bands": 2,
  "1/8th octave / 80 bands": 3,
  "1/6th octave / 60 bands": 4,
  "1/4th octave / 40 bands": 5,
  "1/3rd octave / 30 bands": 6,
  "Half octave / 20 bands": 7,
  "Full octave / 10 bands": 8,
  "Line / Area graph": 10
});

const newFeaturesFolder = gui.addFolder("👉👉 New in v4.0.0");

newFeaturesFolder.add(audioMotion, "ansiBands");
newFeaturesFolder.add(audioMotion, "channelLayout", [
  "single",
  "dual-vertical",
  "dual-combined"
]);

newFeaturesFolder.add(audioMotion, "gradientLeft", [
  "classic",
  "prism",
  "orangered",
  "rainbow",
  "steelblue"
]);
newFeaturesFolder.add(audioMotion, "gradientRight", [
  "classic",
  "prism",
  "orangered",
  "rainbow",
  "steelblue"
]);

newFeaturesFolder.add(audioMotion, "frequencyScale", {
  Bark: "bark",
  Linear: "linear",
  Logarithmic: "log",
  Mel: "mel"
});
newFeaturesFolder.add(audioMotion, "linearAmplitude");
newFeaturesFolder.add(audioMotion, "linearBoost", 1, 5, 0.2);
newFeaturesFolder.add(audioMotion, "noteLabels");
newFeaturesFolder.add(audioMotion, "weightingFilter", {
  none: "",
  "A-weighting": "A",
  "B-weighting": "B",
  "C-weighting": "C",
  "D-weighting": "D",
  "ITU-R 468": "468"
});

const bandsFolder = gui.addFolder("Bands / Graph settings");

bandsFolder.add(audioMotion, "barSpace", 0, 1, 0.1);

bandsFolder.add(audioMotion, "alphaBars");
bandsFolder.add(audioMotion, "ledBars");
bandsFolder.add(audioMotion, "lumiBars");
bandsFolder.add(audioMotion, "outlineBars");
bandsFolder.add(audioMotion, "fillAlpha", 0, 1, 0.1);
bandsFolder.add(audioMotion, "lineWidth", 0, 5, 0.5);

const radialFolder = gui.addFolder("Radial settings");

radialFolder.add(audioMotion, "radial");
radialFolder.add(audioMotion, "spinSpeed", -5, 5, 1);

const reflexFolder = gui.addFolder("Reflex & Mirror settings");

reflexFolder.add(audioMotion, "mirror", -1, 1, 1);
reflexFolder.add(audioMotion, "reflexRatio", 0, 0.9, 0.1);
reflexFolder.add(audioMotion, "reflexAlpha", 0, 1, 0.1);
reflexFolder.add(audioMotion, "reflexBright", 0, 2, 0.1);
reflexFolder.add(audioMotion, "reflexFit");

const switchesFolder = gui.addFolder("Switches");

const switches = [
  "showBgColor",
  "showPeaks",
  "showScaleX",
  "showScaleY",
  "splitGradient",
  "loRes",
  "showFPS"
];

for (let prop of switches) switchesFolder.add(audioMotion, prop);

gui.add(buttons, "link").name(`v${AudioMotionAnalyzer.version}`);

container.appendChild(gui.domElement);