import React, {ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import images from './images';
import {style} from './styles';
import MIcon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  onboarding_list: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
  },
  onboarding_list_item: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 16,
    lineHeight: 25,
  },
  about_link_button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9e9e9e',
  },
  link_tile: {
    flexDirection: 'row',
    marginBottom: 15,
    flex: 1,
  },
  link_tile_image: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  link_tile_label: {
    fontSize: 16,
    flex: 1,
    lineHeight: 25,
  },
  link_text: {
    color: '#1352A5',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  about_link_label: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1352A5',
  },
});

type ListItemProps = {
  style: Record<string, unknown>;
  children: ReactNode;
};

const ListItem = (props: ListItemProps): JSX.Element => {
  return (
    <View style={styles.onboarding_list}>
      <Text style={styles.onboarding_list_item}>{'\u2022'}</Text>
      <Text style={props.style}>{props.children}</Text>
    </View>
  );
};

const Br = (): JSX.Element => {
  return <Text>{'\n'}</Text>;
};

type HeadProps = {
  size?: 'small' | 'medium' | 'large';
  style?: Record<string, unknown>;
  children: ReactNode;
};

const Head = (props: HeadProps): JSX.Element => {
  const size = props.size || 'medium';
  return (
    <Text style={{...props.style, ...style.type.headings[size]}}>
      {props.children}
    </Text>
  );
};

type ParaProps = {
  size?: 'intro' | 'default';
  style?: Record<string, unknown>;
  children: ReactNode;
};

const Para = (props: ParaProps): JSX.Element => {
  const size = props.size || 'default';
  return (
    <Text style={{...style.type.paras[size], ...props.style}}>
      {props.children}
    </Text>
  );
};

type LinkButtonProps = {
  onPress: () => void;
  children: ReactNode;
};

const LinkButton = (props: LinkButtonProps): JSX.Element => {
  return (
    <TouchableOpacity style={styles.about_link_button} onPress={props.onPress}>
      <Text style={styles.about_link_label}>{props.children}</Text>
      <Text>
        <MIcon name="launch" size={18} color="#1352A5" />
      </Text>
    </TouchableOpacity>
  );
};

type LinkTileProps = {
  onPress: () => void;
  icon: string;
  children: ReactNode;
};

const LinkTile = (props: LinkTileProps): JSX.Element => {
  return (
    <View style={styles.link_tile}>
      <TouchableOpacity onPress={props.onPress}>
        <Image
          style={styles.link_tile_image}
          source={images[props.icon] as ImageSourcePropType}
        />
      </TouchableOpacity>
      <Text style={styles.link_tile_label}>{props.children}</Text>
    </View>
  );
};

type LinkTextProps = {
  onPress: () => void;
  style?: Record<string, unknown>;
  children: ReactNode;
};

const LinkText = (props: LinkTextProps): JSX.Element => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={[styles.link_text, props.style]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

export {style, ListItem, Br, Head, Para, LinkButton, LinkTile, LinkText};
