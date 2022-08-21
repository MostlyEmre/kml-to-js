// const corsProxyURL = "https://proxy.emree.workers.dev/?";
// const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
// example analytics url: https://emrelytics.emree.workers.dev/p/kml-to-js/c/10/t/1588010989898

const handleFiles = (e) => {
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();
  let pointsCount = 0;

  reader.addEventListener(
    "load",
    () => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(reader.result, "text/xml");

      const folders = xmlDoc.querySelectorAll("Folder");

      let convertedData = [];

      folders.forEach((folder) => {
        let data = {
          title: folder.firstElementChild.textContent,
          points: [],
        };

        const placemarks = folder.querySelectorAll("Placemark");

        placemarks.forEach((placemark) => {
          let coordinates = placemark.querySelector("coordinates").textContent.split(",");

          let point = {
            text: placemark.firstElementChild.textContent, // title of the place
            lat: parseFloat(coordinates[1].replace(/\s+/g, "")), // 47.6154276
            lng: parseFloat(coordinates[0].replace(/\s+/g, "")), // -122.3497142
          };

          data.points.push(point);
          pointsCount++;
        });
        convertedData.push(data);
      });

      content.innerHTML = JSON.stringify(convertedData, null, 4);
      copyBtn.classList.remove("hidden");
      content.classList.remove("hidden");

      // submits analytics
      pointsCount && analytics("kml-to-js", pointsCount, Date.now());
    },
    false
  );

  if (file) reader.readAsText(file);
};

const content = document.querySelector("#kmlContent");
const inputElement = document.getElementById("inputElement");
inputElement.addEventListener("change", handleFiles, false);

const copyBtn = document.querySelector("#copy");
copyBtn.addEventListener("click", () => copyToClipboard(content.textContent));

// write the array to the user's clipboard
const copyToClipboard = async (string) => {
  navigator.clipboard
    .writeText(string)
    .then(() => (copyBtn.innerText = "Copied!"))
    .then(() =>
      setTimeout(() => {
        copyBtn.innerText = "Copy to clipboard";
      }, 1000)
    )
    .catch((err) => alert("Can't copy to clipboard.", err));
};

const analytics = async (projectName, numberOfItems, timestamp) => {
  // const url = `${corsProxyURL}https://emrelytics.emree.workers.dev/p/${projectName}/c/${numberOfItems}/t/${timestamp}`;
  const url = `https://emrelytics.emree.workers.dev/p/${projectName}/c/${numberOfItems}/t/${timestamp}`;

  await fetch(url);
};
