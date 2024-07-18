// Permissions
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let roles = [];
    // lấy hết tên các quyền trong các mục quyền
    const rows = tablePermission.querySelectorAll("[data-name]");
    // mỗi row là một quyền
    rows.forEach((row) => {
      // duyệt qua từng hàng
      const name = row.getAttribute("data-name"); // lấy tên quyền trong hàng đấy
      const inputs = row.querySelectorAll("input"); // lấy các ô hay còn gọi là các vai trò trong một hàng

      if (name == "id") {
        // duyệt qua từng vai trò
        inputs.forEach((input) => {
          // hàng đầu tiên tên id chứa giá trị id của các vai trò
          const id = input.value;
          roles.push({
            id: id,
            permissions: [], // mảng chứa các quyền của vai trò
          });
        });
      } else {
        // bắt đầu duyệt các hàng chứa quyền
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            // index là thứ tự từ phải sang trái của các vai trò
            roles[index].permissions.push(name);
          }
        });
      }
    });
    // gửi dữ liệu từ frontend tới backend thông qua form
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
  const records = JSON.parse(dataRecords.getAttribute("data-records")); // chuyển dữ liệu từ json to js
  const tablePermissions = document.querySelector("[table-permissions]");
  // Mảng records sẽ lưu các vai trò với index tương ứng thứ tự từ trái sang phải
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
