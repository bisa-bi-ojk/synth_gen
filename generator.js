/**
 * Jakarta Synthetic Dataset Generator - Business Logic
 * Generates realistic demographic data for DKI Jakarta with accurate coordinates
 */

// Jakarta administrative codes and demographic data (Updated with accurate 2024 data)
const jakartaCodes = ['71', '72', '73', '74', '75', '76']; // Central, East, West, South, North, Kepulauan Seribu
const areaNames = ['Jakarta Pusat', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Utara', 'Kepulauan Seribu'];

// Actual population data (Mid-2024, Dukcapil) - Total: 11.34 million
const actualPopulation = {
    total: 11340000,
    distribution: {
        '71': { population: 1090000, weight: 0.0973, kecamatan: 8, kelurahan: 44, name: 'Jakarta Pusat' },
        '72': { population: 3310000, weight: 0.2923, kecamatan: 10, kelurahan: 65, name: 'Jakarta Timur' },
        '73': { population: 2610000, weight: 0.2303, kecamatan: 8, kelurahan: 56, name: 'Jakarta Barat' },
        '74': { population: 2410000, weight: 0.2122, kecamatan: 10, kelurahan: 65, name: 'Jakarta Selatan' },
        '75': { population: 1870000, weight: 0.1652, kecamatan: 6, kelurahan: 32, name: 'Jakarta Utara' },
        '76': { population: 30420, weight: 0.0027, kecamatan: 2, kelurahan: 6, name: 'Kepulauan Seribu' }
    }
};

const areaWeights = [0.0973, 0.2923, 0.2303, 0.2122, 0.1652, 0.0027]; // Updated accurate weights

// Realistic coordinates for each Jakarta administrative area (Updated with Kepulauan Seribu)
const jakartaCoordinates = {
    '71': { // Jakarta Pusat (1.09M - 9.73%)
        centerLat: -6.1745,
        centerLon: 106.8227,
        radiusLat: 0.020,
        radiusLon: 0.020
    },
    '72': { // Jakarta Timur (3.31M - 29.23%) - LARGEST
        centerLat: -6.2248,
        centerLon: 106.9003,
        radiusLat: 0.045,
        radiusLon: 0.050
    },
    '73': { // Jakarta Barat (2.61M - 23.03%)
        centerLat: -6.1352,
        centerLon: 106.7511,
        radiusLat: 0.035,
        radiusLon: 0.040
    },
    '74': { // Jakarta Selatan (2.41M - 21.22%)
        centerLat: -6.2615,
        centerLon: 106.7810,
        radiusLat: 0.040,
        radiusLon: 0.035
    },
    '75': { // Jakarta Utara (1.87M - 16.52%)
        centerLat: -6.1058,
        centerLon: 106.8700,
        radiusLat: 0.030,
        radiusLon: 0.035
    },
    '76': { // Kepulauan Seribu (30.4K - 0.27%)
        centerLat: -5.6100,
        centerLon: 106.6000,
        radiusLat: 0.200,
        radiusLon: 0.300
    }
};

// Demographic distributions based on Jakarta research
const ageRanges = [[0, 14], [15, 24], [25, 54], [55, 64], [65, 85]];
const ageWeights = [0.2502, 0.1699, 0.424, 0.0858, 0.0701];

const educationLevels = ['-', 'sd', 'smp', 'sma', 's1_sederajat', 's2_sederajat', 's3_sederajat'];
const educationWeights = [0.03, 0.18, 0.20, 0.28, 0.25, 0.05, 0.01];

const jobCategories = ['tidak_bekerja', 'ibu_rumah_tangga', 'pelajar', 'pensiunan', 'asn', 'wiraswasta', 'karyawan_swasta', 'pekerja_lepas', 'buruh', 'agratim'];
const jobWeights = [0.08, 0.12, 0.15, 0.06, 0.10, 0.22, 0.18, 0.04, 0.04, 0.01];

const maritalStatus = ['belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati'];
const maritalWeights = [0.4825, 0.458, 0.0187, 0.0408]; // Updated Dukcapil 2024 data

const migrationStatus = ['asli', 'pendatang_menetap', 'perantau_sementara', 'komuter'];
const migrationWeights = [0.42, 0.45, 0.08, 0.05];

// Housing characteristics with Jakarta-specific distributions
const ownershipStatus = ['milik', 'sewa', 'numpang'];
const ownershipWeights = [0.787, 0.213, 0.02]; // Jakarta has high rental rate

const powerCapacities = [450, 900, 1300, 2200, 3500, 5500];
const powerWeights = [0.12, 0.18, 0.28, 0.22, 0.15, 0.05];

const wallMaterials = ['tembok', 'kayu', 'bambu', 'granit'];
const wallWeights = [0.82, 0.12, 0.03, 0.03];

const floorMaterials = ['keramik', 'semen', 'tanah', 'granit', 'marmer'];
const floorWeights = [0.65, 0.22, 0.03, 0.07, 0.03];

const roofMaterials = ['genteng', 'seng', 'asbes'];
const roofWeights = [0.35, 0.45, 0.20];

const waterSources = ['pam', 'sumur', 'mata_air', 'sungai'];
const waterWeights = [0.62, 0.23, 0.12, 0.03];

const sanitationTypes = ['pribadi', 'komunal', 'tidak ada'];
const sanitationWeights = [0.635, 0.30, 0.065];

const internetAccess = ['-', 'kuota', 'wifi'];
const internetWeights = [0.153, 0.55, 0.297]; // Jakarta has 84.7% internet penetration

// Store family coordinates to ensure consistency
const familyCoordinates = new Map();

/**
 * Weighted random selection from array
 */
function weightedRandom(items, weights) {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < items.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
            return items[i];
        }
    }
    return items[items.length - 1];
}

/**
 * Random integer in range
 */
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Normal distribution random number
 */
function normalRandom(mean, stdDev) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * stdDev + mean;
}

/**
 * Generate realistic coordinates for Jakarta area
 */
function generateCoordinates(areaCode) {
    const coords = jakartaCoordinates[areaCode];
    
    // Use normal distribution for more realistic clustering
    const lat = normalRandom(coords.centerLat, coords.radiusLat / 3);
    const lon = normalRandom(coords.centerLon, coords.radiusLon / 3);
    
    // Ensure coordinates stay within bounds
    const boundedLat = Math.max(coords.centerLat - coords.radiusLat, 
                               Math.min(coords.centerLat + coords.radiusLat, lat));
    const boundedLon = Math.max(coords.centerLon - coords.radiusLon, 
                               Math.min(coords.centerLon + coords.radiusLon, lon));
    
    return {
        lat: Math.round(boundedLat * 100000) / 100000, // 5 decimal precision
        lon: Math.round(boundedLon * 100000) / 100000
    };
}

/**
 * Generate valid NIK for Jakarta residents with accurate kecamatan codes
 */
function generateNIK(areaCode, birthDate, gender, sequence) {
    const day = gender === 'F' ? birthDate.getDate() + 40 : birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear() % 100;
    
    // Get correct kecamatan range for each area
    const kecamatanRanges = {
        '71': 8,  // Jakarta Pusat: 01-08
        '72': 10, // Jakarta Timur: 01-10
        '73': 8,  // Jakarta Barat: 01-08
        '74': 10, // Jakarta Selatan: 01-10
        '75': 6,  // Jakarta Utara: 01-06
        '76': 2   // Kepulauan Seribu: 01-02
    };
    
    const maxKecamatan = kecamatanRanges[areaCode] || 8;
    const kecamatan = randomInRange(1, maxKecamatan);
    
    return `31${areaCode}${kecamatan.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year.toString().padStart(2, '0')}${sequence.toString().padStart(4, '0')}`;
}

/**
 * Generate No.KK (Family Card Number)
 */
function generateNoKK(areaCode, regDate, familySeq) {
    const day = regDate.getDate();
    const month = regDate.getMonth() + 1;
    const year = regDate.getFullYear() % 100;
    const subDistrict = randomInRange(1, 30);
    
    return `31${areaCode}${subDistrict.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year.toString().padStart(2, '0')}${familySeq.toString().padStart(4, '0')}`;
}

/**
 * Get consistent education based on age
 */
function getEducationByAge(age) {
    if (age < 6) return '-';
    if (age < 12) return Math.random() > 0.3 ? 'sd' : '-';
    if (age < 15) return weightedRandom(['sd', 'smp'], [0.4, 0.6]);
    if (age < 18) return weightedRandom(['smp', 'sma'], [0.3, 0.7]);
    
    // Adult education distribution (excluding '-')
    const adultEducation = educationLevels.slice(1);
    const adultWeights = educationWeights.slice(1);
    const normalizedWeights = adultWeights.map(w => w / adultWeights.reduce((a, b) => a + b));
    
    return weightedRandom(adultEducation, normalizedWeights);
}

/**
 * Get marital status based on age
 */
function getMaritalStatusByAge(age) {
    if (age < 17) return 'belum_kawin';
    if (age < 25) return weightedRandom(['belum_kawin', 'kawin'], [0.7, 0.3]);
    if (age < 35) return weightedRandom(['belum_kawin', 'kawin'], [0.3, 0.7]);
    return weightedRandom(maritalStatus, maritalWeights);
}

/**
 * Get employment based on age and education
 */
function getEmploymentByAge(age, education) {
    if (age < 15) return 'pelajar';
    if (age >= 65) return weightedRandom(['pensiunan', 'tidak_bekerja'], [0.7, 0.3]);
    
    // Adjust job probabilities based on education
    let adjustedWeights = [...jobWeights];
    
    if (['s1_sederajat', 's2_sederajat', 's3_sederajat'].includes(education)) {
        // Higher education more likely to be ASN or professional
        adjustedWeights[4] *= 2; // asn
        adjustedWeights[6] *= 1.5; // karyawan_swasta
        adjustedWeights[0] *= 0.3; // tidak_bekerja
        adjustedWeights[8] *= 0.2; // buruh
    }
    
    // Normalize weights
    const sum = adjustedWeights.reduce((a, b) => a + b);
    adjustedWeights = adjustedWeights.map(w => w / sum);
    
    return weightedRandom(jobCategories, adjustedWeights);
}

/**
 * Calculate income based on job, education, and age
 */
function calculateIncome(job, education, age) {
    const incomeBase = {
        'tidak_bekerja': 0,
        'ibu_rumah_tangga': 0,
        'pelajar': 0,
        'pensiunan': Math.max(0, normalRandom(4000000, 1500000)),
        'asn': Math.max(0, normalRandom(8000000, 3000000)),
        'wiraswasta': Math.max(0, normalRandom(12000000, 8000000)),
        'karyawan_swasta': Math.max(0, normalRandom(9000000, 4000000)),
        'pekerja_lepas': Math.max(0, normalRandom(6000000, 3000000)),
        'buruh': Math.max(0, normalRandom(5500000, 2000000)),
        'agratim': Math.max(0, normalRandom(4500000, 2000000))
    };
    
    let income = incomeBase[job] || 0;
    
    // Education multiplier
    if (['s1_sederajat', 's2_sederajat', 's3_sederajat'].includes(education)) {
        const eduMultiplier = {
            's1_sederajat': 1.3,
            's2_sederajat': 1.8,
            's3_sederajat': 2.5
        };
        income *= eduMultiplier[education] * (0.8 + Math.random() * 0.8);
    }
    
    // Age experience factor
    if (age >= 30 && income > 0) {
        income *= (1 + (age - 30) * 0.02); // 2% increase per year after 30
    }
    
    return Math.round(income);
}

/**
 * Get employment status based on job
 */
function getEmploymentStatus(job) {
    if (['asn', 'karyawan_swasta'].includes(job)) return 'pekerja_formal';
    if (['wiraswasta', 'pekerja_lepas', 'buruh', 'agratim'].includes(job)) return 'pekerja_informal';
    if (job === 'pensiunan') return 'pensiunan';
    return 'pengangguran';
}

/**
 * Generate single record with data consistency
 */
function generateRecord(i) {
    // Administrative area
    const areaCode = weightedRandom(jakartaCodes, areaWeights);
    
    // Family sequence (4 people per family on average)
    const familySeq = Math.floor(i / 4) + 1;
    const noKKBase = `31${areaCode}_${familySeq}`;
    
    // Get or generate coordinates for this family
    let coordinates;
    if (familyCoordinates.has(noKKBase)) {
        coordinates = familyCoordinates.get(noKKBase);
    } else {
        coordinates = generateCoordinates(areaCode);
        familyCoordinates.set(noKKBase, coordinates);
    }
    
    // Age generation with realistic distribution
    const ageRangeIndex = weightedRandom([0, 1, 2, 3, 4], ageWeights);
    const [minAge, maxAge] = ageRanges[ageRangeIndex];
    const age = randomInRange(minAge, maxAge);
    
    // Birth date
    const currentYear = 2024;
    const birthYear = currentYear - age;
    const birthMonth = randomInRange(1, 12);
    const birthDay = randomInRange(1, 28);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    // Gender
    const gender = Math.random() < 0.51 ? 'M' : 'F';
    
    // Generate NIK and No.KK
    const nik = generateNIK(areaCode, birthDate, gender, i + 1);
    
    const regYear = birthYear + randomInRange(0, Math.min(5, age));
    const regMonth = randomInRange(1, 12);
    const regDay = randomInRange(1, 28);
    const regDate = new Date(regYear, regMonth - 1, regDay);
    const noKK = generateNoKK(areaCode, regDate, familySeq);
    
    // Education based on age (consistent)
    const education = getEducationByAge(age);
    
    // Marital status based on age
    const marital = getMaritalStatusByAge(age);
    
    // Head of household logic
    let isKepalaKeluarga = false;
    if (age >= 25 && marital === 'kawin') {
        isKepalaKeluarga = gender === 'M' ? Math.random() < 0.7 : Math.random() < 0.3;
    } else if (age >= 30) {
        isKepalaKeluarga = Math.random() < 0.4;
    }
    
    // Employment based on age and education
    const job = getEmploymentByAge(age, education);
    
    // Income calculation (consistent with job and education)
    const income = calculateIncome(job, education, age);
    
    // Family composition (realistic)
    const familySize = weightedRandom([1, 2, 3, 4, 5, 6, 7], [0.15, 0.20, 0.25, 0.20, 0.12, 0.06, 0.02]);
    const productiveMembers = Math.min(familySize, Math.max(1, randomInRange(1, familySize)));
    const vulnerableMembers = Math.max(0, familySize - productiveMembers);
    const dependents = isKepalaKeluarga ? Math.max(0, familySize - 1) : randomInRange(0, 3);
    
    // Age-specific boolean flags
    const isBalita = age <= 5;
    const isAnakSD = age >= 6 && age <= 12;
    const isAnakSMP = age >= 13 && age <= 15;
    const isAnakSMA = age >= 16 && age <= 18;
    const isLansia = age >= 60;
    const isHamilOrNifas = gender === 'F' && age >= 15 && age <= 45 && Math.random() < 0.03;
    
    // Disability (1.38% prevalence)
    const disability = weightedRandom(['-', 'fisik', 'sensorik', 'intelektual', 'mental', 'ganda'], 
                                    [0.9862, 0.0048, 0.0035, 0.0028, 0.0021, 0.0007]);
    
    // Housing characteristics
    const ownership = weightedRandom(ownershipStatus, ownershipWeights);
    const electricitySource = weightedRandom(['prabayar', 'pascabayar', 'genset', 'panel_surya', 'numpang', '-'], 
                                           [0.43, 0.48, 0.02, 0.02, 0.03, 0.02]);
    const powerCapacity = weightedRandom(powerCapacities, powerWeights);
    const wallMaterial = weightedRandom(wallMaterials, wallWeights);
    const floorMaterial = weightedRandom(floorMaterials, floorWeights);
    const roofMaterial = weightedRandom(roofMaterials, roofWeights);
    const waterSource = weightedRandom(waterSources, waterWeights);
    
    // Debt information (consistent with income)
    const hasDebt = Math.random() < 0.6;
    let debtSource = null, debtPurpose = null, totalDebt = 0;
    
    if (hasDebt) {
        debtSource = weightedRandom(['bank', 'koperasi', 'rentenir', 'keluarga'], [0.25, 0.30, 0.15, 0.30]);
        debtPurpose = weightedRandom(['modal_usaha', 'konsumsi', 'pendidikan', 'kesehatan', 'misc'], 
                                   [0.35, 0.25, 0.15, 0.15, 0.10]);
        
        if (income > 0) {
            const debtRatio = 0.1 + Math.random() * 2.9;
            totalDebt = income * debtRatio * (0.5 + Math.random() * 23.5);
        } else {
            totalDebt = 500000 + Math.random() * 4500000;
        }
    }
    
    // Environment and technology
    const sanitation = weightedRandom(sanitationTypes, sanitationWeights);
    const wasteManagement = weightedRandom(['dibakar', 'diangkut', 'dibuang ke sungai'], [0.15, 0.80, 0.05]);
    const internet = weightedRandom(internetAccess, internetWeights);
    
    // Distance to facilities (meters, based on Jakarta density)
    const educationDistance = Math.random() * 1500 * Math.exp(Math.random() * 0.5) + 200;
    const healthDistance = Math.random() * 2000 * Math.exp(Math.random() * 0.5) + 300;
    
    // Employment status
    const empStatus = getEmploymentStatus(job);
    
    // Migration status
    const migration = weightedRandom(migrationStatus, migrationWeights);
    
    return {
        nik,
        no_kk: noKK,
        lon_tempat_tinggal: coordinates.lon,
        lat_tempat_tinggal: coordinates.lat,
        usia: age,
        pendidikan_terakhir: education,
        status_perkawinan: marital,
        is_kepala_keluarga: isKepalaKeluarga,
        jumlah_tanggungan_total: dependents,
        kategori_pekerjaan: job,
        pendapatan_bulanan: income,
        status_migrasi: migration,
        jumlah_anggota_keluarga_rentan: vulnerableMembers,
        jumlah_anggota_keluarga_produktif: productiveMembers,
        status_pekerjaan: empStatus,
        is_hamil_or_nifas: isHamilOrNifas,
        is_balita: isBalita,
        is_anak_sd: isAnakSD,
        is_anak_smp: isAnakSMP,
        is_anak_sma: isAnakSMA,
        status_disabilitas: disability,
        is_lansia: isLansia,
        akses_ke_fasilitas_pendidikan_m: Math.round(educationDistance * 10) / 10,
        akses_ke_fasilitas_kesehatan_m: Math.round(healthDistance * 10) / 10,
        sumber_listrik: electricitySource,
        daya_listrik: powerCapacity,
        status_kepemilikan_lahan: ownership,
        jenis_dinding: wallMaterial,
        jenis_lantai: floorMaterial,
        jenis_atap: roofMaterial,
        sumber_air_pakai: waterSource,
        sumber_utang: debtSource,
        tujuan_utang: debtPurpose,
        total_utang: Math.round(totalDebt),
        kategori_sanitasi: sanitation,
        pengelolaan_sampah: wasteManagement,
        akses_internet: internet
    };
}

/**
 * Main dataset generation function with memory optimization for large datasets
 */
async function generateDataset(recordCount = 10000) {
    const button = document.querySelector('.generate-btn');
    const status = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');
    const statsContainer = document.getElementById('statsContainer');
    
    button.disabled = true;
    button.textContent = '⏳ Generating...';
    status.style.display = 'block';
    status.className = 'status-generating';
    
    // Display scale information
    const scaleInfo = getScaleInfo(recordCount);
    status.textContent = `Initializing generation for ${recordCount.toLocaleString()} records (${scaleInfo.percentage})...`;
    document.querySelector('.progress').style.display = 'block';
    
    // Clear previous family coordinates
    familyCoordinates.clear();
    
    // Adaptive batch size and delay based on dataset size
    let batchSize, delayMs;
    if (recordCount >= 5000000) {
        batchSize = 200;
        delayMs = 100;
    } else if (recordCount >= 1000000) {
        batchSize = 500;
        delayMs = 50;
    } else if (recordCount >= 100000) {
        batchSize = 1000;
        delayMs = 25;
    } else {
        batchSize = 2000;
        delayMs = 10;
    }
    
    console.log(`Using batch size: ${batchSize}, delay: ${delayMs}ms for ${recordCount} records`);
    
    const data = [];
    let processedCount = 0;
    
    try {
        // Process in chunks with memory cleanup
        while (processedCount < recordCount) {
            const currentBatchSize = Math.min(batchSize, recordCount - processedCount);
            const batchData = [];
            
            // Generate current batch
            for (let j = 0; j < currentBatchSize; j++) {
                batchData.push(generateRecord(processedCount + j));
            }
            
            // Add to main array
            data.push(...batchData);
            processedCount += currentBatchSize;
            
            // Update progress
            const progress = (processedCount / recordCount) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
            status.textContent = `Generated ${processedCount.toLocaleString()} / ${recordCount.toLocaleString()} records (${progress.toFixed(1)}%)...`;
            
            // Memory management: force garbage collection opportunity
            if (processedCount % (batchSize * 10) === 0) {
                // Clear batch data reference
                batchData.length = 0;
                
                // Give browser time to cleanup and update UI
                await new Promise(resolve => setTimeout(resolve, delayMs));
                
                // Log memory usage for large datasets
                if (recordCount >= 1000000 && typeof performance !== 'undefined' && performance.memory) {
                    const memUsed = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                    console.log(`Progress: ${progress.toFixed(1)}%, Memory used: ${memUsed}MB`);
                }
            } else {
                // Shorter delay for smaller checkpoints
                await new Promise(resolve => setTimeout(resolve, Math.max(5, delayMs / 2)));
            }
        }
        
        status.textContent = 'Processing statistics and creating Excel file...';
        
        // Calculate statistics with memory optimization
        const stats = await calculateStatsOptimized(data, recordCount);
        displayStats(stats);
        
        status.textContent = 'Creating Excel file...';
        
        // Create Excel file with chunked processing for large datasets
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Jakarta_Synthetic_Data');
        
        // Download file
        const fileName = `jakarta_synthetic_${recordCount.toLocaleString().replace(/,/g, '_')}_records_${new Date().toISOString().split('T')[0]}.xlsx`;
        
        status.textContent = 'Downloading file...';
        XLSX.writeFile(workbook, fileName);
        
        status.className = 'status-complete';
        status.textContent = `✅ Dataset berhasil dibuat! File "${fileName}" telah didownload dengan ${recordCount.toLocaleString()} records (${scaleInfo.percentage} populasi Jakarta).`;
        statsContainer.style.display = 'block';
        
        // Final memory cleanup
        data.length = 0;
        
    } catch (error) {
        status.className = 'status-error';
        status.textContent = `❌ Error: ${error.message}`;
        console.error('Generation error:', error);
        console.error('Error stack:', error.stack);
        
        // Provide helpful error messages
        if (error.message.includes('Maximum call stack') || error.message.includes('out of memory')) {
            status.textContent += ' | Try reducing dataset size or closing other browser tabs.';
        }
    } finally {
        button.disabled = false;
        button.textContent = getButtonText();
        document.querySelector('.progress').style.display = 'none';
        
        // Force garbage collection opportunity
        if (typeof window !== 'undefined' && window.gc) {
            window.gc();
        }
    }
}

/**
 * Get scale information for display
 */
function getScaleInfo(recordCount) {
    const percentage = ((recordCount / actualPopulation.total) * 100).toFixed(2);
    let description = '';
    
    if (recordCount >= actualPopulation.total) {
        description = 'Full Population';
    } else if (recordCount >= 1000000) {
        description = 'Large Scale Sample';
    } else if (recordCount >= 100000) {
        description = 'Medium Scale Sample';
    } else {
        description = 'Small Scale Sample';
    }
    
    return { percentage: `${percentage}%`, description };
}

/**
 * Get dynamic button text based on selected scale
 */
function getButtonText() {
    const selectedScale = document.getElementById('recordScale')?.value || '10000';
    const recordCount = parseInt(selectedScale);
    const scaleInfo = getScaleInfo(recordCount);
    
    return `🚀 Generate ${recordCount.toLocaleString()} Records (${scaleInfo.percentage})`;
}

/**
 * Calculate dataset statistics with memory optimization for large datasets
 */
async function calculateStatsOptimized(data, recordCount) {
    const stats = {};
    const chunkSize = 10000; // Process 10K records at a time for stats
    
    // Initialize counters
    let totalAge = 0;
    let minAge = Infinity;
    let maxAge = -Infinity;
    let totalIncome = 0;
    let incomeCount = 0;
    
    const education = {};
    const ownership = {};
    const internet = {};
    const marital = {};
    const areaDistribution = {};
    
    let familyHeadCount = 0;
    const uniqueFamilies = new Set();
    
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;
    
    // Process data in chunks to avoid memory issues
    for (let start = 0; start < data.length; start += chunkSize) {
        const end = Math.min(start + chunkSize, data.length);
        const chunk = data.slice(start, end);
        
        // Process chunk
        for (const record of chunk) {
            // Age stats
            totalAge += record.usia;
            minAge = Math.min(minAge, record.usia);
            maxAge = Math.max(maxAge, record.usia);
            
            // Income stats
            if (record.pendapatan_bulanan > 0) {
                totalIncome += record.pendapatan_bulanan;
                incomeCount++;
            }
            
            // Categorical counters
            education[record.pendidikan_terakhir] = (education[record.pendidikan_terakhir] || 0) + 1;
            ownership[record.status_kepemilikan_lahan] = (ownership[record.status_kepemilikan_lahan] || 0) + 1;
            internet[record.akses_internet] = (internet[record.akses_internet] || 0) + 1;
            marital[record.status_perkawinan] = (marital[record.status_perkawinan] || 0) + 1;
            
            // Area distribution
            const areaCode = record.nik.substring(2, 4);
            const areaData = actualPopulation.distribution[areaCode];
            if (areaData) {
                areaDistribution[areaData.name] = (areaDistribution[areaData.name] || 0) + 1;
            }
            
            // Family head count
            if (record.is_kepala_keluarga) familyHeadCount++;
            
            // Unique families
            uniqueFamilies.add(record.no_kk);
            
            // Coordinate bounds
            minLat = Math.min(minLat, record.lat_tempat_tinggal);
            maxLat = Math.max(maxLat, record.lat_tempat_tinggal);
            minLon = Math.min(minLon, record.lon_tempat_tinggal);
            maxLon = Math.max(maxLon, record.lon_tempat_tinggal);
        }
        
        // Give browser a break every chunk
        if (start % (chunkSize * 5) === 0) {
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    }
    
    // Calculate final stats
    stats.avgAge = (totalAge / data.length).toFixed(1);
    stats.minAge = minAge;
    stats.maxAge = maxAge;
    
    stats.higherEd = ((education.s1_sederajat || 0) + (education.s2_sederajat || 0) + (education.s3_sederajat || 0)) / data.length * 100;
    stats.rentalRate = (ownership.sewa || 0) / data.length * 100;
    stats.avgIncome = incomeCount > 0 ? (totalIncome / incomeCount / 1000000).toFixed(1) : '0';
    stats.internetAccess = ((internet.kuota || 0) + (internet.wifi || 0)) / data.length * 100;
    stats.marriedRate = (marital.kawin || 0) / data.length * 100;
    stats.familyHeads = (familyHeadCount / data.length) * 100;
    
    // Find most represented area
    const maxArea = Object.entries(areaDistribution).reduce((max, [area, count]) => 
        count > max.count ? {area, count} : max, {area: '', count: 0});
    stats.topArea = `${maxArea.area} (${(maxArea.count / data.length * 100).toFixed(1)}%)`;
    
    // Coordinate ranges
    stats.latRange = `${minLat.toFixed(4)} to ${maxLat.toFixed(4)}`;
    stats.lonRange = `${minLon.toFixed(4)} to ${maxLon.toFixed(4)}`;
    
    // Unique families
    stats.uniqueFamilies = uniqueFamilies.size;
    
    // Population scale info
    stats.populationScale = getScaleInfo(recordCount);
    
    return stats;
}

/**
 * Display statistics in UI with comprehensive metrics
 */
function displayStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${stats.avgAge}</span>
            <div>Rata-rata Usia</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.higherEd.toFixed(1)}%</span>
            <div>Pendidikan Tinggi</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.rentalRate.toFixed(1)}%</span>
            <div>Sewa/Kontrak</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.avgIncome}M</span>
            <div>Rata-rata Pendapatan</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.internetAccess.toFixed(1)}%</span>
            <div>Akses Internet</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.marriedRate.toFixed(1)}%</span>
            <div>Status Kawin</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.uniqueFamilies.toLocaleString()}</span>
            <div>Keluarga Unik</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">${stats.populationScale.percentage}</span>
            <div>Dari Populasi Jakarta</div>
        </div>
        <div class="stat-item">
            <span class="stat-number">📍</span>
            <div>${stats.topArea}</div>
        </div>
    `;
}

/**
 * Wrapper function called from HTML button
 */
function generateDatasetFromUI() {
    const selectedScale = document.getElementById('recordScale')?.value || '10000';
    const recordCount = parseInt(selectedScale);
    generateDataset(recordCount);
}

/**
 * Update button text when scale changes
 */
function updateButtonText() {
    const button = document.querySelector('.generate-btn');
    if (button && !button.disabled) {
        button.textContent = getButtonText();
    }
}