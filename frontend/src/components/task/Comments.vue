<script lang="ts" setup>
import type { Comment } from "@/types";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Editor as KEditor } from "@progress/kendo-vue-editor";
import { clone, cloneDeep } from "lodash-es";
import { ref } from "vue";

const props = defineProps<{
  comments: Partial<Comment>[];
}>();

const emit = defineEmits<{
  (e: "changeComments", value: Partial<Comment>[]): void;
}>();

const comments = ref<Partial<Comment>[]>(props.comments);
const commentIndex = ref<number>(-1);
const commentEditor = ref<typeof KEditor | null>(null);

const tools = [
  ["Bold", "Italic", "Underline", "Strikethrough"],
  ["AlignLeft", "AlignCenter", "AlignRight", "AlignJustify"],
  ["Indent", "Outdent"],
  ["OrderedList", "UnorderedList"],
  "FontSize",
  "FormatBlock",
  ["Undo", "Redo"],
  ["Link", "Unlink", "InsertImage", "ViewHtml"],
];

const handleEditComment = (event: any) => {
  commentIndex.value = event.target.attributes["data-attribute"].value;
  commentEditor.value?.setHTML(comments.value[commentIndex.value].message);
};

const handleSaveComment = () => {
  if (commentIndex.value === -1) {
    comments.value = [
      ...comments.value,
      { message: commentEditor.value?.getHTML() },
    ];
  } else {
    const updatedComment = cloneDeep(comments.value[commentIndex.value]);
    updatedComment.message = commentEditor.value?.getHTML();
    comments.value = [
      ...comments.value.slice(0, commentIndex.value),
      updatedComment,
      ...comments.value.slice(commentIndex.value + 1),
    ];
  }
  commentEditor.value?.setHTML("");
  commentIndex.value = -1;
  emit("changeComments", clone(comments.value));
};

const handleRemoveComment = (event: any) => {
  commentIndex.value = event.target.attributes["data-attribute"].value;
  comments.value.splice(commentIndex.value, 1);
  commentEditor.value?.setHTML("");
  emit("changeComments", clone(comments.value));
};
</script>

<template>
  <div class="mt-7">
    <div class="form-label">
      <span class="k-icon k-i-comment"></span><label>Comments</label>
    </div>
    <div>
      <ul>
        <li v-for="(comment, index) in comments" :key="comment.id">
          <div class="comment">
            <span class="message">{{ comment.message }}</span>
            <div class="buttons-bar">
              <span
                class="button k-icon k-i-edit k-i-pencil"
                alt="Edit comment"
                @click="handleEditComment"
                :data-attribute="index"
              ></span>
              <span
                class="button k-icon k-i-delete k-i-trash"
                alt="Remove comment"
                @click="handleRemoveComment"
                :data-attribute="index"
              ></span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <KEditor :tools="tools" class="field" ref="commentEditor"></KEditor>
    <KButton :theme-color="'primary'" class="mt-2" @click="handleSaveComment"
      >Save Comment</KButton
    >
  </div>
</template>

<style scoped>
li {
  @apply m-3;
}

.comment {
  @apply flex justify-between;
}

.message {
  @apply max-w-fit;
}

.buttons-bar {
  @apply flex;
}

.button {
  @apply cursor-pointer ml-2;
}
</style>
