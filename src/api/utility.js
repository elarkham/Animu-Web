// Utilities

function buildFormData(formData, data, parentKey) {
  if (!data) {
    return
  }
  if ((typeof data === 'object')
       && !(data instanceof Date)
       && !(data instanceof File)) {
    Object
      .keys(data)
      .forEach(key => {
        var newParentKey
        if (parentKey) {
          newParentKey = `${parentKey}[${key}]`;
        } else {
          newParentKey = key;
        }
        buildFormData(formData, data[key], newParentKey)
      });
  } else {
    formData.append(parentKey, data)
  }
}

export default {
  jsonToFormData(data) {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData
  }
}
