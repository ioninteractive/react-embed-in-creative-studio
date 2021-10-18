import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import {
  useParams
} from "react-router-dom";
import { api } from '../service/api';
import * as S from './styled';


type CodeBlockConfig = {
  code: string;
  includeFbml: boolean;
  includeSwfObject: boolean;
}

type RouteParamsSchema = {
  pageId: string;
  elementId: string;
}

export interface Content {
  minWidth?: any;
  maxWidth?: any;
  minHeight?: any;
  maxHeight?: any;
  isEmpty?: boolean;
  name?: string;
  widgetType?: string;
  pageId?: number;
  id?: string;
  variationId?: number;
  elementIndex?: string;
  elementId?: string;
  parameters?: any[];
  code?: string;
  includeFbml?: boolean;
  includeSwfObject?: boolean;
}

export interface DataModel {
  id: string;
}

export interface BackgroundImage {
  id: string;
  isEmpty: boolean;
  imageId: number;
  dimX: number;
  dimY: number;
  width: number;
  height: number;
  imageShouldBeOptimized: boolean;
  baseUrl: string;
  hostName: string;
  pageId: number;
  variationId: number;
  elementType: string;
  elementIndex: string;
  elementId: string;
  parentId: string;
  name?: any;
  cropX?: any;
  cropY?: any;
}

export interface Style {
  __type: string;
  isEmpty: boolean;
  dataModel: DataModel;
  backgroundImage: BackgroundImage;
  id: string;
  pageId: number;
  variationId: number;
  elementType: string;
  elementIndex: string;
  elementId: string;
  parentId: string;
}

export interface CodeBlock {
  content?: Content;
  elementTypeName?: string;
  __type?: string;
  pageId?: number;
  elementType?: string;
  variationId?: number;
  elementIndex?: string;
  hasContent?: boolean;
  style?: Style;
  requestedAt?: Date;
  id?: string;
  elementId?: string;
  elementTypeFriendlyName?: string;
  canDelete?: boolean;
  parentId?: string;
}



export const CodeBlockComponent = (): JSX.Element => {
  const { pageId,elementId } = useParams<RouteParamsSchema>()
  const { register, handleSubmit, control, watch, setValue } = useForm<CodeBlockConfig>();
  const [baseCodeBlock, setBaseCodeBlock] = useState<CodeBlock>();

  const watchCode = watch("code");
  const watchIncludeFbml = watch("includeFbml" );
  const watchIncludeSwfObject = watch("includeSwfObject");

  const parentWindow = window.parent;


  useEffect(() => {
    const callbackListenerReceiveMessage = (event: MessageEvent<any>) => {
      if(event.data.type === "codeBlock") {
        const codeBlockSchema =  JSON.parse(event.data.payload);   
    
        if(!!codeBlockSchema?.content?.code) setValue("code", codeBlockSchema?.content?.code)
        if(!!codeBlockSchema?.content?.includeFbml) setValue("includeFbml", true)
        if(!!codeBlockSchema?.content?.includeSwfObject) setValue("includeSwfObject", true)

        setBaseCodeBlock(codeBlockSchema)
      }
    }

    window.addEventListener("message", callbackListenerReceiveMessage, { capture: true, passive: true })

    return () => window.removeEventListener("message", callbackListenerReceiveMessage, true)
  }, [])
  
  
  const setCodeAndCodeBlockConfig = ({ code, includeFbml, includeSwfObject }: CodeBlockConfig) =>
    setBaseCodeBlock(prevState => ({
      ...prevState, content: {
    ...prevState?.content,
    code,
    includeFbml,
    includeSwfObject
  }}))


  useEffect(() => {
    setCodeAndCodeBlockConfig({
      code: watchCode,
      includeFbml: watchIncludeFbml,
      includeSwfObject: watchIncludeSwfObject,
    })
  }, [watchCode, watchIncludeFbml, watchIncludeSwfObject])


  const sendSuccessMessageToParentWindow = (cadeBlock: any) => parentWindow.postMessage({
      type: "success",
      payload: JSON.stringify(cadeBlock)
  }, "https://test.pcm.com")

  
  const onSubmit = async () => {
    if(baseCodeBlock?.hasContent){
     return api.put(
        `/admin/api/pages/${pageId}/elements/widgets/${elementId}/view?asAdvanced=Y`,
        baseCodeBlock
      )
      .then(sendSuccessMessageToParentWindow)
      .catch(error => console.log(JSON.stringify(error)))
    }

    api.post(
      `/admin/api/pages/${pageId}/elements/widgets/${elementId}/view?asAdvanced=Y`,
      baseCodeBlock
    )
    .then(sendSuccessMessageToParentWindow)
    .catch(error => console.log(JSON.stringify(error)))
  };
  

  // useEffect(() => {
  //   if(baseCodeBlock?.content){
  //     if(!!baseCodeBlock?.content?.code) setValue("code", baseCodeBlock?.content?.code)
  //     if(!!baseCodeBlock?.content?.includeFbml) setValue("includeFbml", true)
  //     if(!!baseCodeBlock?.content?.includeSwfObject) setValue("includeSwfObject", true)
  //   }
  // }, [baseCodeBlock?.content])

  return (
  <S.CodeWrapper>
    <form onSubmit={handleSubmit(onSubmit)}>
      <S.TitleWrapper>HTML/script:</S.TitleWrapper>
     
      <Controller
        name="code"
        control={control}
        render={({ field }) =>  (
          <CodeMirror
            value={field.value}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            theme="dark"
            onChange={(value, viewUpdate) => {
              field.onChange(value);
            }}
            autoFocus={true}
            
          />
        )}
      />
      <S.CheckBoxWrapper>
        <div className="form-group form-check">
          <input type="checkbox" {...register('includeFbml')} id="includeFbml" />
          <label htmlFor="includeFbml">Automatically include support for Facebook FBML via  tag</label>
        </div>
        <div className="form-group form-check">
          <input type="checkbox" {...register('includeSwfObject')} id="includeSwfObject" />
          <label htmlFor="includeSwfObject">Automatically include SWFObject for hand-coded Flash support</label>
        </div>
      </S.CheckBoxWrapper>

      <S.ButtonsSectionWrapper>
        <S.Button type="submit">Salvar</S.Button>
      </S.ButtonsSectionWrapper>
    </form>
  </S.CodeWrapper>);
};