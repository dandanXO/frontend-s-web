<template>
  <div class="home-wrapper">
    <h1>Mobileconfig editor</h1>
    <el-form label-width="auto" :model="form" @submit.prevent>
      <el-form-item :label="$t('profileName')" prop="profileName">
        <el-input v-model="form.profileName" />
      </el-form-item>
      <el-form-item :label="$t('profileOrganization')" prop="profileOrganization">
        <el-input v-model="form.profileOrganization" />
      </el-form-item>
      <el-form-item :label="$t('profileDescription')" prop="profileDescription">
        <el-input v-model="form.profileDescription" :autosize="textareaSize" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('profileConsent')" prop="profileConsent">
        <el-input v-model="form.profileConsent" :autosize="textareaSize" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('webclipName')" prop="webclipName">
        <el-input v-model="form.webclipName" />
      </el-form-item>
      <el-form-item :label="$t('webclipIcon')" prop="webclipIcon">
        <button class="img-preview" @click="handleUploadClick" type="button">
          <img v-if="uploadImgObjectUrl" :src="uploadImgObjectUrl" />
        </button>
      </el-form-item>
      <el-form-item :label="$t('webclipUrl')" prop="webclipUrl">
        <el-input v-model="form.webclipUrl" />
      </el-form-item>
      <el-form-item :label="$t('webclipPrecomposedIcon')" prop="webclipPrecomposedIcon">
        <el-checkbox v-model="form.webclipPrecomposedIcon">
          {{ $t("yes") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('webclipFullScreen')" prop="webclipFullScreen">
        <el-checkbox v-model="form.webclipFullScreen">
          {{ $t("yes") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('webclipIgnoreManifestScope')" prop="webclipIgnoreManifestScope">
        <el-checkbox v-model="form.webclipIgnoreManifestScope">
          {{ $t("yes") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('webclipRemovable')" prop="webclipRemovable">
        <el-checkbox v-model="form.webclipRemovable">
          {{ $t("yes") }}
        </el-checkbox>
      </el-form-item>
      <!-- ssl -->
      <el-form-item :label="$t('sslEnabled')" prop="sslEnabled">
        <el-checkbox v-model="form.sslEnabled">
          {{ $t("yes") }}
        </el-checkbox>
      </el-form-item>

      <template v-if="form.sslEnabled">
        <el-form-item :label="$t('sslPublicKeyPath')" prop="sslPublicKeyPath">
          <el-input v-model="form.sslPublicKeyPath">
            <template #append>
              <el-button @click="handleSelectFile('sslPublicKeyPath')">
                {{ $t("selectFile") }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('sslPrivateKeyPath')" prop="sslPrivateKeyPath">
          <el-input v-model="form.sslPrivateKeyPath">
            <template #append>
              <el-button @click="handleSelectFile('sslPrivateKeyPath')">
                {{ $t("selectFile") }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </template>

      <el-button type="primary" @click="handleSubmit">
        {{ $t("submit") }}
      </el-button>
      <input ref="uploadRef" class="img-upload" type="file" accept="image/*" @change="handleUploadFile" />
    </el-form>
    <el-dropdown class="i18n-dropdown" @command="handleDropDownClick">
      <el-button>{{ currentLocalFlag }}</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="cn">中文</el-dropdown-item>
          <el-dropdown-item command="en">English</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup lang="ts">
import { computed, onActivated, onMounted, ref } from "vue";
import converter from "xml-js";
import { v4 } from "uuid";
import copy from "fast-copy";
import { DEFAULT_MOBILE_CONFIG } from "../constant/default";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

interface Form {
  [key: string]: string | boolean | undefined | File | number;
  profileName?: string;
  profileOrganization?: string;
  profileDescription?: string;
  profileConsent?: string;
  webclipName?: string;
  webclipIcon?: File;
  webclipUrl?: string;
  webclipPrecomposedIcon?: boolean;
  webclipFullScreen: boolean;
  webclipIgnoreManifestScope: boolean;
  webclipRemovable: boolean;
  sslEnabled: boolean;
  sslPublicKeyPath?: string;
  sslPrivateKeyPath?: string;
  uuid: string;
  version: number;
  profileType: string;
}

interface FormKeyMap {
  [key: keyof Form]: string | string[];
}

interface Xml {
  declaration: {
    attributes?: {
      [key: string]: any;
    };
  };
  elements: XmlNode[];
}

interface XmlNode {
  name?: string;
  type: string;
  attributes?: {
    [key: string]: any;
  };
  doctype?: string;
  elements?: Array<XmlNode | XmlNodeValue>;
}

interface XmlNodeValue {
  text: string;
  type: string;
}

const DEFAULT_XML_OBJ: Xml = {
  declaration: {
    attributes: {
      version: "1.0",
      encoding: "UTF-8"
    }
  },
  elements: [
    {
      doctype: `plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"`,
      type: "doctype"
    },
    {
      attributes: {
        version: "1.0"
      },
      elements: [
        {
          type: "element",
          name: "dict",
          elements: []
        }
      ],
      type: "element",
      name: "plist"
    }
  ]
};
const textareaSize = {
  minRows: 3
};
const payloadKeyMap: FormKeyMap = {
  profileDescription: "PayloadDescription",
  profileName: "PayloadDisplayName",
  uuid: ["PayloadIdentifier", "PayloadUUID"],
  profileOrganization: "PayloadOrganization",
  webclipRemovable: "payloadRemovalDisallowed",
  version: "PayloadVersion",
  profileType: "PayloadType"
};
const payloadContentKeyMap: FormKeyMap = {
  profileDescription: "PayloadDescription",
  profileName: "PayloadDisplayName",
  uuid: ["PayloadIdentifier", "PayloadUUID"],
  profileOrganization: "PayloadOrganization",
  version: "PayloadVersion",
  webclipFullScreen: "FullScreen",
  webclipIcon: "Icon",
  webclipIgnoreManifestScope: "IgnoreManifestScope",
  webclipRemovable: "IsRemovable",
  webclipName: "Label",
  webclipPrecomposedIcon: "Precomposed",
  webclipUrl: "URL",
  webclipType: "PayloadType"
};

const { locale, t } = useI18n();

const form = ref<Form>({
  uuid: v4(),
  profileName: undefined,
  profileOrganization: undefined,
  profileDescription: undefined,
  profileConsent: undefined,
  webclipName: undefined,
  webclipIcon: undefined,
  webclipUrl: undefined,
  webclipPrecomposedIcon: true,
  webclipFullScreen: true,
  webclipIgnoreManifestScope: true,
  webclipRemovable: true,
  sslEnabled: false,
  sslPublicKeyPath: undefined,
  sslPrivateKeyPath: undefined,
  version: 1,
  webclipType: "com.apple.webClip.managed",
  profileType: "Configuration"
});

const uploadRef = ref<HTMLInputElement>();
const uploadImgObjectUrl = ref<string>();

const currentLocalFlag = computed(() => {
  switch (locale.value) {
    case "en":
      return t("lang");
    case "cn":
    default:
      return t("lang");
  }
});

const handleDropDownClick = (value: string) => {
  locale.value = value;
  localStorage.setItem("languageLocale", value);
};

const handleUploadClick = () => uploadRef.value?.click();

const handleUploadFile = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const file = files[0];
  if (uploadImgObjectUrl.value) {
    window.URL.revokeObjectURL(uploadImgObjectUrl.value);
  }
  uploadImgObjectUrl.value = window.URL.createObjectURL(file);
  form.value.webclipIcon = file;
};

const handleSelectFile = async (key: keyof Form) => {
  const [filePath] = await window.ipcRenderer.invoke("dialog:openFile");
  form.value[key] = filePath;
};

const handleSubmit = async () => {
  const _xmlObj = copy(DEFAULT_XML_OBJ);
  // @ts-ignore
  const entry = _xmlObj.elements[1].elements[0].elements;
  const consentTextNode = [
    generateXmlNode("key", "element", [generateXmlNode("ConsentText", "text")]),
    generateXmlNode("dict", "element", [
      generateXmlNode("key", "element", [generateXmlNode("default", "text")]),
      await generateXmlValue(form.value.profileConsent, "profileConsent")
    ])
  ];
  const payloadContentNode = [
    generateXmlNode("key", "element", [generateXmlNode("PayloadContent", "text")]),
    generateXmlNode("array", "element", [generateXmlNode("dict", "element", [])])
  ];
  // @ts-ignore
  const payloadContentEntry = payloadContentNode[1].elements[0].elements;
  await fillData(payloadContentEntry, payloadContentKeyMap);
  entry.push(...consentTextNode, ...payloadContentNode);

  await fillData(entry, payloadKeyMap);
  entry.push(
    generateXmlNode("key", "element", [generateXmlNode("PayloadRemovalDisallowed", "text")]),
    await generateXmlValue(!form.value.webclipRemovable, "")
  );
  form.value.uuid = v4();

  if (form.value.sslEnabled) {
    await buildSslSignFile(_xmlObj);
  } else {
    downloadUnSignedFile(_xmlObj);
  }
};

const downloadUnSignedFile = (_xmlObj: Xml) => {
  const blob = new Blob([converter.js2xml(_xmlObj, { spaces: 2 })], {
    type: "application/x-apple-aspen-config"
  });
  const anchor = document.createElement("a");
  const downloadUrl = window.URL.createObjectURL(blob);
  anchor.href = downloadUrl;
  anchor.setAttribute("download", "unSign.mobileconfig");
  anchor.click();
  window.URL.revokeObjectURL(downloadUrl);
  anchor.remove();
};

const buildSslSignFile = async (_xmlObj: Xml) => {
  try {
    console.log("start");
    const unSignConfigPath = await window.ipcRenderer.invoke(
      "file:writeMobileconfig",
      converter.js2xml(_xmlObj, { spaces: 2 })
    );
    console.log("write mobile config end");
    if (!unSignConfigPath) throw new Error();
    if (!form.value.sslPublicKeyPath || !form.value.sslPrivateKeyPath) {
      ElMessage.error(t("sslPemInfoMissing"));
      return;
    }
    const hasOpenSsl = await window.ipcRenderer.invoke("check:openssl");
    console.log("check openssl end");
    if (!hasOpenSsl) {
      ElMessage.error(t("opensslNotFound"));
      return;
    }
    const saveResult = await window.ipcRenderer.invoke("dialog:saveFile", {
      title: t("saveDialogTitle"),
      fileName: `${form.value.profileName}.mobileconfig`
    });
    console.log("save file end");
    if (saveResult.canceled) return;
    if (!saveResult.filePath) throw new Error();
    // console.log(form.value.sslPublicKeyPath, form.value.sslPrivateKeyPath, unSignConfigPath, saveResult.filePath);
    await window.ipcRenderer.invoke("file:signBySsl", {
      publicKeyPath: form.value.sslPublicKeyPath,
      privateKeyPath: form.value.sslPrivateKeyPath,
      mobileconfigFilePath: unSignConfigPath,
      outputPath: saveResult.filePath
    });
    console.log("end");
  } catch (e) {
    console.log(e);
    ElMessage.error(t("unexpectedError"));
  }
};

const fillData = async (entry: Array<XmlNode>, dataset: FormKeyMap) => {
  for await (const [formKey, xmlKey] of Object.entries(dataset)) {
    const formValue = form.value[formKey];
    if (typeof xmlKey === "string") {
      if (xmlKey === "payloadRemovalDisallowed") continue;
      const keyXmlNode = generateXmlNode("key", "element", [generateXmlNode(xmlKey, "text")]);
      const valueXmlNode = await generateXmlValue(formValue, formKey);
      entry.push(keyXmlNode, valueXmlNode);
    } else {
      for await (const _xmlKey of xmlKey) {
        const keyXmlNode = generateXmlNode("key", "element", [generateXmlNode(_xmlKey, "text")]);
        const valueXmlNode = await generateXmlValue(
          _xmlKey === "PayloadIdentifier" ? `${form.value.profileType}.${form.value.uuid}` : formValue,
          formKey
        );
        entry.push(keyXmlNode, valueXmlNode);
      }
    }
  }
};

const generateXmlValue = async (data: string | File | boolean | undefined | number, key: string) => {
  return new Promise<XmlNode>((resolve) => {
    if (data === undefined) {
      resolve(generateXmlNode("string", "element", [generateXmlNode(DEFAULT_MOBILE_CONFIG[key] ?? "", "text")]));
      return;
    }
    if (data instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = () => {
        const shouldBeRemovePrefix = /^data:[a-zA-Z0-9+/=]+;base64,/;
        const result = reader.result?.toString().replace(shouldBeRemovePrefix, "");
        resolve(generateXmlNode("data", "element", [generateXmlNode(result, "text")]));
      };
    } else if (typeof data === "boolean") {
      resolve(generateXmlNode(`${data}`, "element"));
    } else if (typeof data === "number") {
      resolve(generateXmlNode("integer", "element", [generateXmlNode(`${data}`, "text")]));
    } else {
      resolve(generateXmlNode("string", "element", [generateXmlNode(data, "text")]));
    }
  });
};

const generateXmlNode = (
  name?: string,
  type: string = "element",
  elements?: Array<XmlNode | XmlNodeValue>
): XmlNode | XmlNodeValue => {
  if (type === "element") {
    const result: XmlNode = {
      type,
      name: name ?? ""
    };
    if (elements) result.elements = elements;
    return result;
  } else {
    return {
      type,
      text: name ?? ""
    };
  }
};

onMounted(() => console.log("mounted"));
onActivated(() => console.log("activated"));
</script>
<style lang="scss" scoped>
.home-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  .el-form {
    text-align: center;
    width: 80%;
  }

  .img-preview {
    position: relative;
    width: 70px;
    height: 70px;
    border: 2px dashed #bbb;
    background-color: unset;
    cursor: pointer;

    &::before,
    &::after {
      position: absolute;
      content: "";
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #bbb;
    }

    &::before {
      width: 3px;
      height: 28px;
    }

    &::after {
      height: 3px;
      width: 28px;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      z-index: 1;
    }
  }
  .img-upload {
    display: none;
  }
  .i18n-dropdown {
    position: fixed;
    right: 10px;
    top: 10px;
  }
}
</style>
