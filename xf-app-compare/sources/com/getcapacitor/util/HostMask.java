package com.getcapacitor.util;

import androidx.webkit.ProxyConfig;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public interface HostMask {

    public static class Nothing implements HostMask {
        public boolean matches(String str) {
            return false;
        }
    }

    boolean matches(String str);

    public static class Parser {
        private static HostMask NOTHING = new Nothing();

        public static HostMask parse(String[] strArr) {
            return strArr == null ? NOTHING : Any.parse(strArr);
        }

        public static HostMask parse(String str) {
            return str == null ? NOTHING : Simple.parse(str);
        }
    }

    public static class Simple implements HostMask {
        private final List<String> maskParts;

        private Simple(List<String> list) {
            if (list != null) {
                this.maskParts = list;
                return;
            }
            throw new IllegalArgumentException("Mask parts can not be null");
        }

        static Simple parse(String str) {
            return new Simple(Util.splitAndReverse(str));
        }

        public boolean matches(String str) {
            if (str == null) {
                return false;
            }
            List<String> splitAndReverse = Util.splitAndReverse(str);
            int size = splitAndReverse.size();
            int size2 = this.maskParts.size();
            if (size2 > 1 && size != size2) {
                return false;
            }
            int min = Math.min(size, size2);
            for (int i = 0; i < min; i++) {
                if (!Util.matches(this.maskParts.get(i), splitAndReverse.get(i))) {
                    return false;
                }
            }
            return true;
        }
    }

    public static class Any implements HostMask {
        private final List<? extends HostMask> masks;

        Any(List<? extends HostMask> list) {
            this.masks = list;
        }

        public boolean matches(String str) {
            for (HostMask matches : this.masks) {
                if (matches.matches(str)) {
                    return true;
                }
            }
            return false;
        }

        static Any parse(String... strArr) {
            ArrayList arrayList = new ArrayList();
            for (String parse : strArr) {
                arrayList.add(Simple.parse(parse));
            }
            return new Any(arrayList);
        }
    }

    public static class Util {
        static boolean matches(String str, String str2) {
            if (str == null) {
                return false;
            }
            if (ProxyConfig.MATCH_ALL_SCHEMES.equals(str)) {
                return true;
            }
            if (str2 == null) {
                return false;
            }
            return str.toUpperCase().equals(str2.toUpperCase());
        }

        static List<String> splitAndReverse(String str) {
            if (str != null) {
                List<String> asList = Arrays.asList(str.split("\\."));
                Collections.reverse(asList);
                return asList;
            }
            throw new IllegalArgumentException("Can not split null argument");
        }
    }
}
