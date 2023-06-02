
import React, { useLayoutEffect, useRef } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { scale } from 'utils/scale'

export default function InputNumber({ index, value, focus, onChangeText, onKeyPress }) {
    const inputRef = useRef()

    useLayoutEffect(() => {
        if (inputRef.current) {
            if (focus) {
                inputRef.current.focus()
            }
        }
    }, [focus])

    return (
        <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={onChangeText.bind(this, index)}
            onKeyPress={onKeyPress.bind(this, index)}
            selectTextOnFocus
        />
    )
}

const styles = StyleSheet.create({
    input: {
        height: 56,
        borderWidth: 1,
        backgroundColor: "rgba(250, 250, 250, 1)",
        borderColor: "rgba(238, 238, 238, 1)",
        borderRadius: 12,
        marginHorizontal: 4,
        flex: 1,
        fontSize: scale(24),
        fontWeight: '600',
        textAlign: "center"
    }
})