$(document).ready(function () {
  // Add New Entry button click event
  $("#addNewEntry").on("click", function () {
    $("#newEntryForm").show();
  });

  // Send button click event
  $("#sendButton").on("click", function () {
    const name = $("#nameInput").val();

    // AJAX request to the backend
    $.ajax({
      url: "backend.php",
      method: "POST",
      data: { action: "add", name: name },
      success: function (response) {
        var result = $.parseJSON(response);
        // Handle the success response from the backend
        if (result.id) {
          addRow(result.id, name, result.datetime);
        }
      },
      error: function (error) {
        // Handle the error
        console.log("Error: " + error.responseText);
      },
    });

    // Reset the form
    $("#nameInput").val("");
    $("#newEntryForm").hide();
  });

  // Function to add a new row to the table
  function addRow(id, name, datetime) {
    const newRow = `
            <tr data-id="${id}">
                <td>${id}</td>
                <td>${name}</td>
                <td>${datetime}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            </tr>
        `;
    $("#dataTable tbody").append(newRow);

    // Attach edit and delete event handlers to the new row
    const row = $("#dataTable tbody tr:last");
    attachRowHandlers(row);
  }

  // Function to attach edit and delete event handlers to a row
  function attachRowHandlers(row) {
    row.find(".edit").on("click", function () {
      const nameCell = row.find("td:eq(1)");
      const editButton = row.find(".edit");
      const deleteButton = row.find(".delete");
      const id = row.data("id");
      deleteButton.hide();
      if (editButton.text() === "Edit") {
        // Enable edit mode
        nameCell.attr("contenteditable", true).focus();
        editButton.text("Save");
      } else {
        // Save changes
        const name = nameCell.text();
        // AJAX request to the backend to update the name
        $.ajax({
          url: "backend.php",
          method: "POST",
          data: { action: "edit", id: id, name: name },
          success: function (response) {
            var result = $.parseJSON(response);
            if (result.success) {
              nameCell.attr("contenteditable", false);
              editButton.text("Edit");
              deleteButton.show();
            }
          },
          error: function (error) {
            console.log("Error: " + error.responseText);
          },
        });
      }
    });

    row.find(".delete").on("click", function () {
      const id = row.data("id");
      // AJAX request to the backend to delete the record
      $.ajax({
        url: "backend.php",
        method: "POST",
        data: { action: "delete", id: id },
        success: function (response) {
          var result = $.parseJSON(response);
          if (result.success) {
            row.remove();
          }
        },
        error: function (error) {
          console.log("Error: " + error.responseText);
        },
      });
    });
  }

  // Function to load initial data from the backend and populate the table
  function loadInitialData() {
    // AJAX request to fetch initial data from the backend
    $.ajax({
      url: "backend.php",
      method: "GET",
      success: function (response) {
        var result = $.parseJSON(response);
        // Populate the table with data from the response
        result.forEach(function (item) {
          addRow(item.id, item.name, item.datetime);
        });
      },
      error: function (error) {
        console.log("Error: " + error.responseText);
      },
    });
  }

  // Call the function to load initial data
  loadInitialData();
});
