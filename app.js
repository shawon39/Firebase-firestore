const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

const renderCafe = (doc) => {
	let li = document.createElement("li");
	let name = document.createElement("span");
	let city = document.createElement("span");
	let cross = document.createElement("div");

	li.setAttribute("data-id", doc.id);
	name.textContent = doc.data().name;
	city.textContent = doc.data().city;
	cross.textContent = "x";

	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(cross);

	cafeList.appendChild(li);

	// deleting data
	cross.addEventListener("click", (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute("data-id");
		db.collection("cafes").doc(id).delete();
	});
};

// getting data
// db.collection("cafes").where("city", "==", "Dhaka").get()
// db.collection("cafes").where("city", "==", "Dhaka").orderBy('name').get()

/*
db.collection("cafes")
	.where("city", "==", "Dhaka")
	.orderBy("name")
	.get()
	.then((snapshot) => {
		snapshot.docs.forEach((doc) => {
			renderCafe(doc);
		});
	}); */

// saving data
form.addEventListener("submit", (e) => {
	e.preventDefault();
	db.collection("cafes").add({
		name: form.name.value,
		city: form.city.value,
	});
	form.name.value = "";
	form.city.value = "";
});

// getting data on realtime
db.collection("cafes")
	.orderBy("city")
	.onSnapshot((snapshot) => {
		let changes = snapshot.docChanges();
		changes.forEach((change) => {
			if (change.type === "added") {
				renderCafe(change.doc);
			} else if (change.type === "removed") {
				let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
				cafeList.removeChild(li);
			}
		});
	});

// for updating data

// db.collection("cafes").doc("S5pQiVBt4q3S3IM198oT").update({
// 	name: "Dark cafe dhanmondi",
// 	city: "Dhaka City",
// });

// There is another method called set which override the rest of the property. we can use set/update depends on situation.
