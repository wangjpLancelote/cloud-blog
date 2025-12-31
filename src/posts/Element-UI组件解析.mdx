---
title: Element-UI组件解析
---

<aside>
💡 组件上层封装基本上都是基于已有的UI组件库或者是结合一些前端框架开进行的，如利用ElementUI或者antd进行二次开发，利用Vue/React等前端框架，结合一下UI库如TailwindCSS进行UI修饰，完成封装

</aside>

ElementUI：Form 组件拆解

<aside>
💡 Form组件一直是各大UI框架的重头戏，以ElementUI为例，看看Form组件是如何设计的。

</aside>

先来看看 ElementUI 的 Form 组件是如何使用的

```html
<el-form :model="form" label-width="auto" style="max-width: 600px">
  <el-form-item label="Activity name" props="name">
    <el-input v-model="form.name" />
  </el-form-item>
</el-form>
```

el-form 组件作为最外层包裹的标签，model 属性是整个 form 组件传入的对象，内部的 form-item 包裹了具体组件内容，作为每个 form 组件的具体表现形式，在 form-item 标签上的属性 props 则是接收 form 传入的 model 对象的属性值，不需要在 input 上指定 v-model，即可更新 form.name 的值，那么这里面是怎么做的呢。

```html
<--! Form组件 -->
<template>
  <form :class="formClasses">
    <slot />
  </form>
</template>
```

上面的 Form 组件能看到，ElementUI 的 Form 组件是用的 html 原声的 form 标签实现的，传入一个 formClasses 覆盖原声的 class 样式

Form 组件用了 provide/inject 依赖注入的方式传递深层次属性，首先进行 provide 依赖收集

```tsx
provide(
  formContextKey,
  reactive({
    ...toRefs(props),
    emit,

    resetFields,
    clearValidate,
    validateField,
    getField,
    addField,
    removeField,

    ...useFormLabelWidth(),
  })
)
这里的formContextKey是一个常量，用symbol修饰的变量
export const formContextKey: InjectionKey<FormContext> =
  Symbol('formContextKey')
export const formItemContextKey: InjectionKey<FormItemContext> =
  Symbol('formItemContextKey')
```

上面的 emit 是 form 组件导出的方法：validate，以及 resetField 之类的都是 form 全局方法，通过 form 全局依赖注入到 formContextKey 上，具体使用场景举个例子：

```tsx
const formRef = ref(); // 赋值给Form组件的ref属性变量

formRef.validate();
formRef.resetFields();

// 这里的formRef是赋值给elForm组件的ref变量，使用的就是Form组件导出的全局变量
```

Form 组件完成了一些全局方法的注册，外层 props 的定义，以及顶层 form 标签的构建，那么 formItem 是如何接收这些属性的呢：inject

```tsx
const formContext = inject(formContextKey, undefined);
const parentFormItemContext = inject(formItemContextKey, undefined);
// formContext就是从Form组件传入的属性内容
// 将Form组件的属性model的数据获取之后，返回对应的value，用于在formItem中进行表单校验等处理
const fieldValue = computed(() => {
  const model = formContext?.model;
  if (!model || !props.prop) {
    return;
  }
  return getProp(model, props.prop).value;
});

// 这里获取的propString就是在formItem标签上的属性prop的内容，表示获取每个formItem的字段
const propString = computed(() => {
  if (!props.prop) return "";
  return isString(props.prop) ? props.prop : props.prop.join(".");
});

// 对每个formItem上的prop属性进行表单检验处理
const doValidate = async (rules: RuleItem[]): Promise<true> => {
  const modelName = propString.value;
  const validator = new AsyncValidator({
    [modelName]: rules,
  });
  return validator
    .validate({ [modelName]: fieldValue.value }, { firstFields: true })
    .then(() => {
      onValidationSucceeded();
      return true as const;
    })
    .catch((err: FormValidateFailure) => {
      onValidationFailed(err as FormValidateFailure);
      return Promise.reject(err);
    });
};
```

这里有个问题，如何将 formItem 下的组件的值赋值给 model.prop 的属性上

```tsx
// 这里model.prop会将值作为fieldValue的默认值
const fieldValue = computed(() => {
  const model = formContext?.model;
  if (!model || !props.prop) {
    return;
  }
  return getProp(model, props.prop).value;
});

initialValue = clone(fieldValue.value);

// 那么在input等组件的值发生改变的时候，formItem又是如何监听到值的变化并且完成model.prop的更新的呢
// 这里用computed计算属性，返回model.prop的值，而在input等组件上使用v-model对model.prop实现数据的双向绑定
// 因此formItem下的input等组件必须要显示的将model.prop双向绑定上
const fieldValue = computed(() => {
  const model = formContext?.model;
  if (!model || !props.prop) {
    return;
  }
  return getProp(model, props.prop).value;
});

// 此外，input组件会传入form属性，这个form属性的值就是从Form组件全局导出的，用于确定form表单下的id对应值
// 同一个id对应的表单项会互相关联
```

```html
<input :id="inputId" :form="form" />

const { form: elForm, formItem: elFormItem } = useFormItem() <--!
这里的inputId和Form导出的是同一个实例 -->
```

<aside>
💡 总结：Form和FormItem之间的数据传递是用的provide和inject，FormItem组件下的input等组件的数据双向绑定则是借助了form属性和id属性，封装了formItemHooks用于组件内部调用以使用Form和FormItem这两个全局变量，所有的全局方法以defineExpose的形式导出

</aside>

ElementUI：Table 组件

<aside>
💡 Table组件的难点主要在表格宽高自适应，固定行和列，多级表格的样式，是比Form组件的设计难度更加大的存在

</aside>

Table 组件导出了两个组件模块：Table 和 TableColumn，先来看看 Table 组件的设计

整个 Table 组件的 template 部分分为两个区域，整个组件由外层的 tableWrapper 包裹，tableWrapper 外层布局融合了传入的 style 和 class 属性，规定了 table 整体的布局，这些 style 和 class 以命名空间的形式动态的加载到 class 中

table 的核心分为：原生 table 包裹，table-header 组件，table-body，table-footer

其中，bodyWrapper 下使用了 scrollbar 组件包裹，目的是解决表格超出当前页面高度时，出现滚动条

```html
<div ref="bodyWrapper" :class="ns.e('body-wrapper')">
  <el-scrollbar
    ref="scrollBarRef"
    :view-style="scrollbarViewStyle"
    :wrap-style="scrollbarStyle"
    :always="scrollbarAlwaysOn"
  >
    <table
      ref="tableBody"
      :class="ns.e('body')"
      cellspacing="0"
      cellpadding="0"
      border="0"
      :style="{
              width: bodyWidth,
              tableLayout,
            }"
    >
      <hColgroup
        :columns="store.states.columns.value"
        :table-layout="tableLayout"
      />
      <table-header
        v-if="showHeader && tableLayout === 'auto'"
        ref="tableHeaderRef"
        :class="ns.e('body-header')"
        :border="border"
        :default-sort="defaultSort"
        :store="store"
        @set-drag-visible="setDragVisible"
      />
      <table-body
        :context="context"
        :highlight="highlightCurrentRow"
        :row-class-name="rowClassName"
        :tooltip-effect="tooltipEffect"
        :tooltip-options="tooltipOptions"
        :row-style="rowStyle"
        :store="store"
        :stripe="stripe"
      />
      <table-footer
        v-if="showSummary && tableLayout === 'auto'"
        :class="ns.e('body-footer')"
        :border="border"
        :default-sort="defaultSort"
        :store="store"
        :sum-text="computedSumText"
        :summary-method="summaryMethod"
      />
    </table>
    <div
      v-if="isEmpty"
      ref="emptyBlock"
      :style="emptyBlockStyle"
      :class="ns.e('empty-block')"
    >
      <span :class="ns.e('empty-text')">
        <slot name="empty">{{ computedEmptyText }}</slot>
      </span>
    </div>
    <div
      v-if="$slots.append"
      ref="appendWrapper"
      :class="ns.e('append-wrapper')"
    >
      <slot name="append" />
    </div>
  </el-scrollbar>
</div>
```

table-footer 是为了显示什么内容呢，上图能看到 showSummary，当需要显示表格总计的情况时，就在 table-footer 上显示

一个一个分析 Table 组件，从 table-header 开始

table-header 是用的 h()方法渲染的 UI，导出的是一个含有 setup 方法并且返回用 h 函数渲染的 dom 结构，具体设计如下

```jsx
return h(
  "thead",
  {
    class: { [ns.is("group")]: isGroup },
  },
  columnRows.map((subColumns, rowIndex) =>
    h(
      "tr",
      {
        class: getHeaderRowClass(rowIndex),
        key: rowIndex,
        style: getHeaderRowStyle(rowIndex),
      },
      subColumns.map((column, cellIndex) => {
        if (column.rowSpan > rowSpan) {
          rowSpan = column.rowSpan;
        }
        return h(
          "th",
          {
            class: getHeaderCellClass(rowIndex, cellIndex, subColumns, column),
            colspan: column.colSpan,
            key: `${column.id}-thead`,
            rowspan: column.rowSpan,
            style: getHeaderCellStyle(rowIndex, cellIndex, subColumns, column),
            onClick: ($event) => handleHeaderClick($event, column),
            onContextmenu: ($event) => handleHeaderContextMenu($event, column),
            onMousedown: ($event) => handleMouseDown($event, column),
            onMousemove: ($event) => handleMouseMove($event, column),
            onMouseout: handleMouseOut,
          },
          [
            h(
              "div",
              {
                class: [
                  "cell",
                  column.filteredValue && column.filteredValue.length > 0
                    ? "highlight"
                    : "",
                ],
              },
              [
                column.renderHeader
                  ? column.renderHeader({
                      column,
                      $index: cellIndex,
                      store,
                      _self: $parent,
                    })
                  : column.label,
                column.sortable &&
                  h(
                    "span",
                    {
                      onClick: ($event) => handleSortClick($event, column),
                      class: "caret-wrapper",
                    },
                    [
                      h("i", {
                        onClick: ($event) =>
                          handleSortClick($event, column, "ascending"),
                        class: "sort-caret ascending",
                      }),
                      h("i", {
                        onClick: ($event) =>
                          handleSortClick($event, column, "descending"),
                        class: "sort-caret descending",
                      }),
                    ]
                  ),
                column.filterable &&
                  h(FilterPanel, {
                    store,
                    placement: column.filterPlacement || "bottom-start",
                    column,
                    upDataColumn: (key, value) => {
                      column[key] = value;
                    },
                  }),
              ]
            ),
          ]
        );
      })
    )
  )
);
```

table-body 和 table-header 的思路相似，也是利用 tr、td、tbody 这些原生标签实现 dom 的构建

```jsx
// tbody的render实现
return h("tbody", { tabIndex: -1 }, [
  data.reduce((acc: VNode[], row) => {
    return acc.concat(wrappedRowRender(row, acc.length));
  }, []),
]);
```

```jsx
// tfoot标签的render实现
return h(
      h('tfoot', [
        h('tr', {}, [
          ...columns.map((column, cellIndex) =>
            h(
              'td',
              {
                key: cellIndex,
                colspan: column.colSpan,
                rowspan: column.rowSpan,
                class: getCellClasses(columns, cellIndex),
                style: getCellStyles(column, cellIndex),
              },
              [
                h(
                  'div',
                  {
                    class: ['cell', column.labelClassName],
                  },
                  [sums[cellIndex]]
                ),
              ]
            )
          ),
        ]),
      ])
```

# 可以借鉴的一些做法

- Style：和样式相关的内容，放在同一个文件内，如 styles-helper.ts，避免样式失效，要注意 style 行内样式顺序，classnames 的合并注意同名 class
- Events：emit 事件放在 events-hepler.ts
- 将不同的渲染内容区分开：如 table 的 footer、header、column 等等，都是作为单独 render 的组件聚合到一起
- Provider 和 Inject 的 key 用 symbol 修饰，并且使用常量命名，注意，使用 ts 类型断言的 as const
- 是否需要使用 store，看组件的复杂程度，element-UI 中的 Table 和 Form 均使用了 store，store 会增加组件的复杂度，谨慎使用
- Vue3 版本中推荐使用 hooks 抽象逻辑
- 单元测试：开发组件一定要加入单元测试，目的是为了发现组件设计的盲点和不合理的地方，甚至是内存管理问题。

# 最后，附上 Element-UI 的仓库地址和文档地址

[Element-UI 文档](https://element-plus.org/zh-CN/component/form.html)

[Element-Git 仓库](https://github.com/element-plus/element-plus/tree/dev/packages)
