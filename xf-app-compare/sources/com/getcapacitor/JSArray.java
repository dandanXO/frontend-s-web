package com.getcapacitor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;

public class JSArray extends JSONArray {
    public JSArray() {
    }

    public JSArray(String str) throws JSONException {
        super(str);
    }

    public JSArray(Collection collection) {
        super(collection);
    }

    public JSArray(Object obj) throws JSONException {
        super(obj);
    }

    public <E> List<E> toList() throws JSONException {
        ArrayList arrayList = new ArrayList();
        int i = 0;
        while (i < length()) {
            get(i);
            try {
                arrayList.add(get(i));
                i++;
            } catch (Exception unused) {
                throw new JSONException("Not all items are instances of the given type");
            }
        }
        return arrayList;
    }

    public static JSArray from(Object obj) {
        try {
            return new JSArray(obj);
        } catch (JSONException unused) {
            return null;
        }
    }
}
