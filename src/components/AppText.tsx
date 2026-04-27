import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { fonts } from "../theme/fonts";
import { typography } from "../theme/typography";
import { textAlign } from "../utils/rtl";

type Variant = "title" | "subtitle" | "body" | "caption" | "small";

interface Props extends TextProps {
    children: React.ReactNode;
    variant?: Variant;
    bold?: boolean;
    style?: TextStyle | TextStyle[];
}

export default function AppText({
    children,
    variant = "body",
    bold,
    style,
    ...props
}: Props) {
    const fontSize = typography[variant];

    const fontFamily = bold ? fonts.bold : fonts.regular;

    return (
        <Text
            allowFontScaling={false}
            {...props}
            style={[
                {
                    fontSize,
                    fontFamily,
                    textAlign,
                    color: "#222",
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
}
