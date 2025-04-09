//khởi tạo map
const map = L.map("map").setView([10.0218, 105.7846], 13); //13 mức độ thu phóng
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
storeLocations.forEach(function (item) {
  if (item.name === "user") {
    standinPoint = L.marker(item.position, { icon: customuser })
      .addTo(map)
      .bindPopup(`Điểm đang đứng`);
    funHover(standinPoint);
  } else {
    const marker = L.marker(item.position, { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `Tọa độ ${item.name}:<br/> (${item.position[0].toFixed(3)}, ${item.position[1].toFixed(3)})`
      );
    funHover(marker);
    marker.on("click", () => {
      L.Routing.control({
        waypoints: [L.latLng([10.05119, 105.77371]), L.latLng(item.position)],
        createMarker: function (i, waypoint, n) {
          return null; // không tạo marker nào cả (ẩn luôn icon mặc định)
        },
      }).on("routesfound", function (e) {
          e.routes[0].coordinates.forEach((item, index) => {
            setTimeout(() => {
              standinPoint.setLatLng([item.lat, item.lng]);
            }, index * 20);
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
let ArrayPInit = [];
let PointerInit;
let count = 0;
map.on("click", (e) => {
  points.push(e.latlng);
  ++count;
  poiAdd(e.latlng.lat, e.latlng.lng);
  AppHTML(points);
  funUpdate();
  zoom();
});
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
const AppHTML = (poin, id) => {
  var chuoi = "";
  try {
    poin.forEach((item, index) => {
      chuoi += `<tr id = "tr${index}">
    <td>${index + 1}</td>
    <td>${item.lat.toFixed(3)}</td>
    <td>${item.lng.toFixed(3)}</td>
  </tr>`;
    });
  } catch (error) {
    chuoi += `<tr id = "tr${id}">
    <td>${id + 1}</td>
    <td>${poin._latlng.lat.toFixed(3)}</td>
    <td>${poin._latlng.lng.toFixed(3)}</td>
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
function zoom() {
  let listTr = [];
  for(let i = 0; i<points.length; ++i){
    let tr = document.querySelector(`#tr${i}`);
    listTr.push(tr);
    listTr[i].addEventListener("mouseover", () => {
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
  }
}
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
  if (valuelati && valuelong) {
    addPoint(valuelati, valuelong);
    document.querySelector(".container #lat").value = "";
    document.querySelector(".container #lng").value = "";
  } else {
    alert("Không hợp lệ");
  }
};
const listSugges = [
  { coords: [10.031, 105.773] },
  { coords: [10.025, 105.764] },
  { coords: [10.026, 105.748] },
];
function showSuggestions() {
  let flag = false;
  const input = document.getElementById("lat").value;
  const sugDiv = document.getElementById("latSuggestions");
  sugDiv.innerHTML = ""; // Xóa các gợi ý cũ
  if (input.trim() !== "") {
    listSugges.forEach((item) => {
      const value = item.coords[0].toString();
      if (value.includes(input)) {
        flag = true;
        sugDiv.classList.add("suggestions");
        const suggesItem = document.createElement("div");
        suggesItem.className = "suggestion-item";
        suggesItem.innerText = `${item.coords[0]}, ${item.coords[1]}`;
        // Thêm sự kiện click vào gợi ý
        suggesItem.addEventListener("click", function () {
          document.getElementById("lat").value = item.coords[0];
          document.getElementById("lng").value = item.coords[1];
          sugDiv.innerHTML = ""; // Xóa gợi ý sau khi chọn
          sugDiv.classList.remove("suggestions");
        });
        suggesItem.addEventListener("mouseover", function () {
          document.getElementById("lat").value = item.coords[0];
          document.getElementById("lng").value = item.coords[1];
        });
        sugDiv.appendChild(suggesItem);
      }
    });
    if (!flag) {
      sugDiv.classList.remove("suggestions");
    }
  } else sugDiv.classList.remove("suggestions");
}
