import { Component, Show, mergeProps } from "solid-js";

const Container: Component<{}> = ({props}) => {
  
  const merged = mergeProps(
   {headerslot: false, pageLeft: false, pageRight: false, footerslot: false}, props);

  return (
  <div id="container">
     <Show when={props.headerslot}>
        <header id="container-header" class="z-10"> <slot name="header"/> </header>
     </Show>

     <div id="page" class="h-screen ">

     </div>

  </div>
  );
};

export default Container;