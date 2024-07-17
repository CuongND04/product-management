// Permissions
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let roles = [];
    const rows = tablePermission.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      // duyệt qua từng hàng
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          roles.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            roles[index].permissions.push(name);
          }
        });
      }
    });
    console.log(roles);
    if (roles.length > 0) {
      const formChangePermissions = document.querySelector(
        "[form-change-permissions]"
      );
      const inputRoles = formChangePermissions.querySelector(
        "input[name='roles']"
      );
      inputRoles.value = JSON.stringify(roles); // js to json
      formChangePermissions.submit();
    }
  });
}
// END Permissions

// Permission Data Default
const dataRecords = document.querySelector("[data-records]"); // thẻ div chứa record từ backend
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("[table-permissions]");
  // Mảng records sẽ lưu 2 thằng quản trị viên, quản trị nd với index tương ứng 0,1
  records.forEach((record, index) => {
    const permissions = record.permissions;
    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(
        `tr[data-name="${permission}"]`
      ); // tìm cái hàng có name là permission

      const input = row.querySelectorAll(`input`)[index]; // tìm cái ô input được chọn

      input.checked = true;
    });
  });
}
// END Permission Data Default
