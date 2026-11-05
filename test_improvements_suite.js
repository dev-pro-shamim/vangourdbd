const http = require("http");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";

function makeRequest(method, urlPath, data, isMultipart = false, boundary = "") {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const headers = {};

    if (isMultipart) {
      headers["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
    } else if (data) {
      headers["Content-Type"] = "application/json";
    }

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers,
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// Helper to construct multipart payload with multiple files
function createMultipartPayload(files, folder = "products") {
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
  let payload = "";

  for (const file of files) {
    payload += `--${boundary}\r\n`;
    payload += `Content-Disposition: form-data; name="files"; filename="${file.name}"\r\n`;
    payload += `Content-Type: ${file.type || "image/jpeg"}\r\n\r\n`;
    payload += file.content + "\r\n";
  }

  payload += `--${boundary}\r\n`;
  payload += `Content-Disposition: form-data; name="folder"\r\n\r\n`;
  payload += `${folder}\r\n`;
  payload += `--${boundary}--\r\n`;

  return { boundary, payload: Buffer.from(payload) };
}

async function runTests() {
  console.log("=================================================================");
  console.log("STARTING IMPROVEMENTS & MISSING FEATURES VERIFICATION SUITE");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // 1. MULTIPLE PRODUCT IMAGE UPLOAD (10 IMAGES SIMULTANEOUSLY)
    // -------------------------------------------------------------
    console.log("--- 1. MULTIPLE PRODUCT IMAGE UPLOAD (10 SIMULTANEOUS FILES) ---");
    const tenFiles = [];
    for (let i = 1; i <= 10; i++) {
      tenFiles.push({
        name: `test_product_image_${i}.jpg`,
        type: "image/jpeg",
        content: `Simulated JPEG binary header payload test image number ${i} for gallery upload`,
      });
    }

    const { boundary, payload } = createMultipartPayload(tenFiles, "products");
    const uploadRes = await makeRequest("POST", "/api/media", payload, true, boundary);
    assert(
      uploadRes.status === 201 && uploadRes.data.success && uploadRes.data.count === 10,
      "Upload 10 images simultaneously with multipart/form-data"
    );

    const uploadedUrls = uploadRes.data.files ? uploadRes.data.files.map((f) => f.url) : [];
    assert(uploadedUrls.length === 10, "10 valid public URL paths generated in /assets/uploads/");

    // -------------------------------------------------------------
    // 2. PRODUCT GALLERY MANAGEMENT & REORDERING
    // -------------------------------------------------------------
    console.log("\n--- 2. PRODUCT GALLERY MANAGEMENT & REORDERING ---");
    const sampleProductPayload = {
      name: "Tactical Combat Over-Shirt",
      slug: `tactical-combat-overshirt-${Date.now()}`,
      sku: "VGD-TACT-01",
      category: "Shirt",
      price: 1850,
      compareAtPrice: 2200,
      stockQuantity: 45,
      images: uploadedUrls,
      sizes: ["M", "L", "XL"],
      colors: ["#111111", "#4A5568"],
      description: "Tactical combat shirt with multi-pocket utility and heavy GSM twill.",
    };

    const prodCreateRes = await makeRequest("POST", "/api/products", JSON.stringify(sampleProductPayload));
    assert(prodCreateRes.status === 201 && prodCreateRes.data.success, "Create product with 10 uploaded gallery images");
    const createdProductId = prodCreateRes.data.data.id;

    // Change featured image (move 5th image to index 0)
    const reorderedImages = [...uploadedUrls];
    const newFeatured = reorderedImages.splice(4, 1)[0];
    reorderedImages.unshift(newFeatured);

    const prodUpdateRes = await makeRequest("PUT", `/api/products/${createdProductId}`, JSON.stringify({
      images: reorderedImages,
    }));
    assert(
      prodUpdateRes.status === 200 && prodUpdateRes.data.data.images[0] === newFeatured,
      "Change featured/primary image in product gallery"
    );

    // Delete single image from gallery
    const imagesWithOneRemoved = reorderedImages.slice(1);
    const prodRemoveImgRes = await makeRequest("PUT", `/api/products/${createdProductId}`, JSON.stringify({
      images: imagesWithOneRemoved,
    }));
    assert(
      prodRemoveImgRes.status === 200 && prodRemoveImgRes.data.data.images.length === 9,
      "Delete individual image from product gallery (10 -> 9)"
    );

    // -------------------------------------------------------------
    // 3. CATEGORY & SUBCATEGORY IMAGE UPLOAD & REPLACEMENT
    // -------------------------------------------------------------
    console.log("\n--- 3. CATEGORY & SUBCATEGORY IMAGE UPLOAD ---");
    const catImageFile = [
      {
        name: "category_banner_tactical.jpg",
        type: "image/jpeg",
        content: "Simulated category banner artwork binary payload",
      },
    ];
    const catUpload = createMultipartPayload(catImageFile, "categories");
    const catUploadRes = await makeRequest("POST", "/api/media", catUpload.payload, true, catUpload.boundary);
    assert(catUploadRes.status === 201 && catUploadRes.data.success, "Upload category artwork image file");
    const catImageUrl = catUploadRes.data.data?.url || catUploadRes.data.files?.[0]?.url;

    // Create root category with image
    const newCatPayload = {
      name: "Tactical Outerwear",
      slug: `tactical-outerwear-${Date.now()}`,
      image: catImageUrl,
      description: "Heavy-duty windbreakers and weatherproof shells.",
      order: 10,
      isEnabled: true,
    };
    const catCreateRes = await makeRequest("POST", "/api/categories", JSON.stringify(newCatPayload));
    assert(catCreateRes.status === 201 && catCreateRes.data.success, "Create category with uploaded image");
    const createdCatId = catCreateRes.data.data.id;

    // Replace category image
    const replacementImageFile = [
      {
        name: "category_banner_tactical_v2.jpg",
        type: "image/jpeg",
        content: "Simulated category banner replacement v2 artwork binary",
      },
    ];
    const catReplace = createMultipartPayload(replacementImageFile, "categories");
    const catReplaceRes = await makeRequest("POST", "/api/media", catReplace.payload, true, catReplace.boundary);
    const replacementUrl = catReplaceRes.data.data?.url || catReplaceRes.data.files?.[0]?.url;

    const catUpdateRes = await makeRequest("PUT", `/api/categories/${createdCatId}`, JSON.stringify({
      image: replacementUrl,
    }));
    assert(
      catUpdateRes.status === 200 && catUpdateRes.data.data.image === replacementUrl,
      "Replace category image with newly uploaded asset"
    );

    // Create nested subcategory with image
    const subcatPayload = {
      name: "Tactical Vests",
      slug: `tactical-vests-${Date.now()}`,
      parentId: createdCatId,
      image: replacementUrl,
      description: "MOLLE modular tactical utility vests.",
      order: 1,
      isEnabled: true,
    };
    const subcatCreateRes = await makeRequest("POST", "/api/categories", JSON.stringify(subcatPayload));
    assert(
      subcatCreateRes.status === 201 && subcatCreateRes.data.data.parentId === createdCatId,
      "Create nested subcategory with subcategory image and parent relationship"
    );

    // -------------------------------------------------------------
    // 4. WEBSITE TEXT CMS
    // -------------------------------------------------------------
    console.log("\n--- 4. COMPLETE WEBSITE TEXT EDITING CMS ---");
    const updatedTexts = [
      {
        key: "hero_title",
        label: "Hero Banner Main Heading",
        value: "VANGUARD BD - TACTICAL INNOVATION",
        group: "homepage",
      },
      {
        key: "hero_subtitle",
        label: "Hero Banner Subtitle",
        value: "ENGINEERED URBAN WEAR 2026",
        group: "homepage",
      },
      {
        key: "footer_bio",
        label: "Footer Brand Description",
        value: "Dhaka's premier tactical technical apparel brand. Engineered for extreme endurance.",
        group: "footer",
      },
    ];

    const textSaveRes = await makeRequest("POST", "/api/text-content", JSON.stringify(updatedTexts));
    assert(textSaveRes.status === 200 && textSaveRes.data.success, "Save & publish bulk website text modifications");

    const textFetchRes = await makeRequest("GET", "/api/text-content?group=homepage");
    const fetchedHero = textFetchRes.data.data?.find((t) => t.key === "hero_title");
    assert(
      fetchedHero && fetchedHero.value === "VANGUARD BD - TACTICAL INNOVATION",
      "Retrieve updated website text from backend API"
    );

    // -------------------------------------------------------------
    // 5. COUPON MANAGEMENT SYSTEM & CHECKOUT DISCOUNT VALIDATION
    // -------------------------------------------------------------
    console.log("\n--- 5. COUPON MANAGEMENT & CHECKOUT DISCOUNT VALIDATION ---");
    // Create percentage coupon (30% off, min ৳1000, max ৳600)
    const percCouponPayload = {
      code: "TESTPERC30",
      description: "30% off up to ৳600",
      discountType: "percentage",
      discountValue: 30,
      minOrderAmount: 1000,
      maxDiscountAmount: 600,
      usageLimit: 100,
      usageLimitPerCustomer: 1,
      status: "active",
    };
    const cpn1Res = await makeRequest("POST", "/api/coupons", JSON.stringify(percCouponPayload));
    assert(cpn1Res.status === 201 && cpn1Res.data.success, "Create percentage coupon (TESTPERC30)");

    // Create fixed amount coupon (Flat ৳150 off, min ৳800)
    const flatCouponPayload = {
      code: "TESTFLAT150",
      description: "Flat ৳150 off",
      discountType: "fixed",
      discountValue: 150,
      minOrderAmount: 800,
      usageLimit: 100,
      usageLimitPerCustomer: 1,
      status: "active",
    };
    const cpn2Res = await makeRequest("POST", "/api/coupons", JSON.stringify(flatCouponPayload));
    assert(cpn2Res.status === 201 && cpn2Res.data.success, "Create flat discount coupon (TESTFLAT150)");

    // Create expired coupon
    const expiredCouponPayload = {
      code: "EXPIRED50",
      description: "Expired coupon",
      discountType: "fixed",
      discountValue: 50,
      minOrderAmount: 500,
      expiryDate: "2025-01-01",
      status: "active",
    };
    const cpn3Res = await makeRequest("POST", "/api/coupons", JSON.stringify(expiredCouponPayload));
    assert(cpn3Res.status === 201 && cpn3Res.data.success, "Create expired coupon (EXPIRED50)");

    // Validation 1: Percentage calculation with cap
    // Subtotal = 2500 -> 30% = 750 -> capped at 600
    const val1 = await makeRequest("POST", "/api/coupons/validate", JSON.stringify({
      code: "TESTPERC30",
      subtotal: 2500,
    }));
    assert(
      val1.status === 200 && val1.data.success && val1.data.data.discountAmount === 600,
      "Server-side discount calculation: 30% of ৳2,500 properly capped at ৳600"
    );

    // Validation 2: Below minimum order threshold
    const val2 = await makeRequest("POST", "/api/coupons/validate", JSON.stringify({
      code: "TESTPERC30",
      subtotal: 600,
    }));
    assert(
      val2.status === 400 && val2.data.success === false,
      "Validation rejects coupon when subtotal is below min order amount (৳600 < ৳1000)"
    );

    // Validation 3: Flat discount calculation
    const val3 = await makeRequest("POST", "/api/coupons/validate", JSON.stringify({
      code: "TESTFLAT150",
      subtotal: 1200,
    }));
    assert(
      val3.status === 200 && val3.data.success && val3.data.data.discountAmount === 150,
      "Server-side flat discount: ৳150 deducted on subtotal ৳1,200"
    );

    // Validation 4: Expired coupon rejection
    const val4 = await makeRequest("POST", "/api/coupons/validate", JSON.stringify({
      code: "EXPIRED50",
      subtotal: 1000,
    }));
    assert(
      val4.status === 400 && val4.data.success === false && val4.data.error.includes("expired"),
      "Validation rejects expired coupon"
    );

    // Validation 5: Invalid/Non-existent coupon rejection
    const val5 = await makeRequest("POST", "/api/coupons/validate", JSON.stringify({
      code: "INVALID_CODE_XYZ",
      subtotal: 1000,
    }));
    assert(
      val5.status === 400 && val5.data.success === false && val5.data.error.includes("does not exist"),
      "Validation rejects invalid / non-existent coupon code"
    );

    // -------------------------------------------------------------
    // 6. ORDER SUBMISSION WITH COUPON & USAGE RECORDING
    // -------------------------------------------------------------
    console.log("\n--- 6. ORDER SUBMISSION WITH COUPON & USAGE TRACKING ---");
    const orderWithCouponPayload = {
      customerName: "Mahmud Hasan",
      customerPhone: "01876543210",
      address: "House 45, Road 7, Banani",
      city: "Dhaka",
      district: "Dhaka",
      items: [
        {
          productId: createdProductId,
          name: "Tactical Combat Over-Shirt",
          price: 1850,
          quantity: 1,
          size: "L",
          sku: "VGD-TACT-01",
        },
      ],
      subtotal: 1850,
      shippingFee: 70,
      couponCode: "TESTFLAT150",
      couponDiscount: 150,
      total: 1770,
      paymentMethod: "Cash on Delivery",
    };

    const orderSubmitRes = await makeRequest("POST", "/api/orders", JSON.stringify(orderWithCouponPayload));
    assert(
      orderSubmitRes.status === 201 && orderSubmitRes.data.success,
      "Place checkout order with applied coupon discount"
    );

    // Verify coupon usage count incremented
    const cpnCheckRes = await makeRequest("GET", `/api/coupons/${cpn2Res.data.data.id}`);
    assert(
      cpnCheckRes.status === 200 && cpnCheckRes.data.data.usedCount >= 1,
      "Coupon usage count automatically incremented in database upon order placement"
    );

  } catch (err) {
    console.error("Test execution failed with error:", err);
  }

  console.log("\n=================================================================");
  console.log(`IMPROVEMENTS SUITE SUMMARY: ${passed}/${passed + failed} TESTS PASSED (${Math.round((passed / (passed + failed)) * 100)}%)`);
  console.log("=================================================================");
}

runTests();
