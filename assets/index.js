//khởi tạo map
const map = L.map("map").setView([10.0218, 105.7846], 13); //13 tỉ lệ phóng. số cao sẽ phóng to. ngược lại
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
const customIcon = L.icon({
  iconUrl: "./assets/img/restaurant.png",
  iconSize: [38, 38], //kích thước của icon
});
const customuser = L.icon({
  iconUrl: "./assets/img/hacker.png",
  iconSize: [38, 38], //kích thước của icon
});
//*Câu 1: Xây dựng bản đồ các điểm bán hàng có sẵn
const storeLocations = [
  { name: "user", position: [10.05119, 105.77371] }, //vị trí người đang đứng
  { name: "Cửa hàng 1", position: [10.0191, 105.7819] },
  { name: "Cửa hàng 2", position: [9.994, 105.71646] },
  { name: "Cửa hàng 3", position: [10.06504, 105.7592] },
  { name: "Cửa hàng 4", position: [10.04156, 105.73774] },
  { name: "Cửa hàng 5", position: [10.0257, 105.6868] },
];
// Thêm các điểm bán hàng lên bản đồ
//*Câu 2:
var standinPoint;
storeLocations.forEach(function (store, index) {
  if (store.name === "user") {
    standinPoint = L.marker(store.position, { icon: customuser })
      .addTo(map)
      .bindPopup(`Điểm đang đứng`);
    standinPoint.on("mouseover", function () {
      this.openPopup();
    }).on("click", ()=>{
      AppHTML(standinPoint, index-1)
    });
  } else {
    const marker = L.marker(store.position, { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `Tọa độ ${store.name}:<br/> (${store.position[0].toFixed(
          3
        )}, ${store.position[1].toFixed(3)})`
      );
    funHover(marker);
    marker.on("click", () => {
      AppHTML(marker,index-1 )
      L.Routing.control({
        waypoints: [
          L.latLng(storeLocations[0].position),
          L.latLng(store.position),
        ],
        createMarker: function (i, waypoint, n) {
          return null; // không tạo marker nào cả (ẩn luôn icon mặc định)
        },
      })
        .on("routesfound", function (e) {
          e.routes[0].coordinates.forEach((item, index) => {
            setTimeout(() => {
              standinPoint.setLatLng([item.lat, item.lng]);
            }, index * 30);
          });
        })
        .addTo(map);
    });
  }
});
//*Câu 3, 4, 5:
// Chọn hai điểm bất kỳ trên bản đồ
let coordContainer = document.getElementById("coordinates");
let points = [];
let PointerInit;
let ArrayPInit = [];
let count = 0;
map.on("click", (e) => {
  points.push(e.latlng);
  ++count;
  poiAdd(e.latlng.lat, e.latlng.lng);
  funUpdate();
  AppHTML(points);
  //zoom
  zoom();
});
const zoom = () => {
  let aparts = [];
  for (let i = 0; i < points.length; ++i) {
    let apart = document.querySelector(`#tr${i}`);
    aparts.push(apart);
    aparts[i].addEventListener("mouseover", () => {
      map.flyTo(points[i], 15);
      ArrayPInit[i]
        .bindPopup(
          `Điểm ${i + 1}<br/>Tọa độ: (${[
            points[i].lat.toFixed(3),
            points[i].lng.toFixed(3),
          ]})`
        )
        .openPopup();
    });
    aparts[i].addEventListener("mouseleave", () => {
      map.flyTo(points[i], 13);
      ArrayPInit[i].closePopup();
    });
    let listpointer = document.querySelector(".container .listPointer");
    listpointer.addEventListener("click", () => {
      map.flyTo([10.0218, 105.7846], 13);
    });
  }
};
function funHover(pointer) {
  pointer.on("mouseover", function () {
    this.openPopup();
  });
  pointer.on("mouseout", function () {
    this.closePopup();
  });
}
const poiAdd = (lat, lng) => {
  PointerInit = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: "./assets/img/location-mark.png",
      iconSize: [38, 38],
    }),
  })
    .addTo(map)
    .bindPopup(
      `Điểm ${count}<br/>Tọa độ: (${[lat.toFixed(3), lng.toFixed(3)]})`
    );
  ArrayPInit.push(PointerInit);
  for (let i = 0; i < ArrayPInit.length; ++i) {
    funHover(ArrayPInit[i]);
    ArrayPInit[i].on("click", () => {
      AppHTML(ArrayPInit[i], i);
      let apart = document.querySelector(`#tr${i}`);
      apart.addEventListener("mouseover", () => {
        map.flyTo(ArrayPInit[i]._latlng, 15);
        ArrayPInit[i]
          .bindPopup(
            `Điểm ${i + 1}<br/>Tọa độ: (${[
              points[i].lat.toFixed(3),
              points[i].lng.toFixed(3),
            ]})`
          )
          .openPopup();
      });
      apart.addEventListener("mouseleave", () => {
        map.flyTo(ArrayPInit[i]._latlng, 13);
        ArrayPInit[i].closePopup();
      });
    });
  }
};
const funUpdate = () => {
  if (points.length >= 2) {
    L.Routing.control({
      waypoints: points,
      routeWhileDragging: true,
      createMarker: function (i, waypoint, n) {
        return null; // không tạo marker nào cả (ẩn luôn icon mặc định)
      },
    }).addTo(map);
  }
};
//*Câu 7:
const AppHTML = (point, id = 0) => {
  var chuoi = "";
  try {
    point.forEach((item, index) => {
      chuoi += `<tr id = "tr${index}">
      <td>${index + 1}</td>
      <td>${item.lat.toFixed(3)}</td>
      <td>${item.lng.toFixed(3)}</td>
    </tr>`;
    });
  } catch (error) {
    chuoi += `<tr id = "tr${id}">
    <td>${id + 1}</td>
    <td>${point._latlng.lat.toFixed(3)}</td>
    <td>${point._latlng.lng.toFixed(3)}</td>
  </tr>`;
  }
  var chuoixuli = `
          <table >
            <tr>
              <th>Điểm</th>
              <th>Vĩ Độ</th>
              <th>Kinh Độ</th>
            </tr>
            ${chuoi}
          </table>`;
  coordContainer.innerHTML = chuoixuli;
};

//*Câu 7:
// Nhập tọa độ trực tiếp
function addPoint(Lat, Lng) {
  points.push({ lat: Lat, lng: Lng });
  ++count;
  poiAdd(Lat, Lng);
  funUpdate();
  AppHTML(points);
  zoom();
}
const handleClick = () => {
  var valuelati = Number(document.querySelector(".container #lat").value);
  var valuelong = Number(document.querySelector(".container #lng").value);
  console.log(ArrayPInit);
  if (valuelati && valuelong) {
    addPoint(valuelati, valuelong);
    document.querySelector(".container #lat").value = "";
    document.querySelector(".container #lng").value = "";
  } else {
    alert("Không hợp lệ");
  }
};
const predefinedCoordinates = [
  { coords: [10.031, 105.773] },
  { coords: [10.025, 105.764] },
  { coords: [10.026, 105.748] },
  { coords: [10.036, 105.787] },
];
function showSuggestions() {
  const input = document.getElementById("lat").value;
  let flag = false;
  const suggestionsDiv = document.getElementById("latSuggestions");
  suggestionsDiv.innerHTML = ""; // Xóa các gợi ý cũ
  if (input.trim() !== "") {
    predefinedCoordinates.forEach((item) => {
      const value = item.coords[0].toString();
      const value2 = item.coords[1].toString();
      if (value.includes(input) || value2.includes(input)) {
        flag = true;
        suggestionsDiv.classList.add("suggestions");
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        suggestionItem.innerText = `${item.coords[0]}, ${item.coords[1]}`;
        // Thêm sự kiện click vào gợi ý
        suggestionItem.addEventListener("click", function () {
          document.getElementById("lat").value = item.coords[0];
          document.getElementById("lng").value = item.coords[1];
          suggestionsDiv.innerHTML = ""; // Xóa gợi ý sau khi chọn
          suggestionsDiv.classList.remove("suggestions");
        });
        suggestionItem.addEventListener("mouseover", function () {
          document.getElementById("lat").value = item.coords[0];
          document.getElementById("lng").value = item.coords[1];
        });
        suggestionItem.addEventListener("mouseleave", function () {
          document.getElementById("lat").value = "";
          document.getElementById("lng").value = "";
        });
        suggestionsDiv.appendChild(suggestionItem);
      }
    });
    if (!flag) {
      suggestionsDiv.classList.remove("suggestions");
    }
  } else suggestionsDiv.classList.remove("suggestions");
}
document.addEventListener("click", function (e) {
  const suggestionsDiv = document.getElementById("latSuggestions");
  suggestionsDiv.innerHTML = ""; // Xóa gợi ý sau khi chọn
  suggestionsDiv.classList.remove("suggestions");
});
